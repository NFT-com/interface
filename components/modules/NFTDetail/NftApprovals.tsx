import { NULL_ADDRESS } from 'constants/addresses';
import { Nft } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useLooksrareRoyaltyFeeRegistryContractContract } from 'hooks/contracts/useLooksrareRoyaltyFeeRegistryContract';
import { useLooksrareStrategyContract } from 'hooks/contracts/useLooksrareStrategyContract';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignLooksrareOrder } from 'hooks/useSignLooksrareOrder';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { getLooksrareNonce, listLooksrare, listSeaport } from 'utils/listings';
import { createLooksrareParametersForNFTListing } from 'utils/looksrareHelpers';
import { createSeaportParametersForNFTListing } from 'utils/seaportHelpers';

import { Addresses, addressesByNetwork, MakerOrder } from '@looksrare/sdk';
import { ethers } from 'ethers';
import { PartialDeep } from 'type-fest';
import { SeaportOrderParameters } from 'types';
import { useAccount, useNetwork, useProvider } from 'wagmi';

export interface NFTApprovalsProps {
  nft: PartialDeep<Nft>;
}

export function NftApprovals(props: NFTApprovalsProps) {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const provider = useProvider();

  const seaportCounter = useSeaportCounter(account?.address);
  const signOrderForSeaport = useSignSeaportOrder();

  const signOrderForLooksrare = useSignLooksrareOrder();
  const looksrareRoyaltyFeeRegistry = useLooksrareRoyaltyFeeRegistryContractContract(provider);
  const looksrareStrategy = useLooksrareStrategyContract(provider);

  const { mutate: mutateListings } = useExternalListingsQuery(props?.nft?.contract, props?.nft?.tokenId, props.nft?.wallet.chainId);

  const {
    allowedAll: openseaAllowed,
    requestAllowance: requestOpensea
  } = useNftCollectionAllowance(
    props.nft?.contract,
    account?.address,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
    requestAllowance: requestLooksrare
  } = useNftCollectionAllowance(
    props.nft?.contract,
    account?.address,
    TransferProxyTarget.LooksRare
  );
  
  return <div className="w-full flex sm:flex-col items-center justify-around text-primary-text dark:text-primary-txt-dk">
    <div>
        looksrare:{' '}
      {
        looksRareAllowed ?
          <>
            <span
              className='text-link hover:underline cursor-pointer ml-2'
              onClick={async () => {
                const addresses: Addresses = addressesByNetwork[activeChain?.id];
                const nonce: number = await getLooksrareNonce(account?.address);
                const order: MakerOrder = await createLooksrareParametersForNFTListing(
                  account?.address, // offerer
                  props.nft,
                  ethers.utils.parseEther('10'), // price
                  addresses.WETH,
                  activeChain?.id,
                  nonce,
                  looksrareStrategy,
                  looksrareRoyaltyFeeRegistry,
                );
                const signature = await signOrderForLooksrare(order);
                const result = await listLooksrare({ ...order, signature });
                if (result) {
                  mutateListings();
                }
              }}
            >
              List Now
            </span>
          </> :
          <span
            className='text-link hover:underline cursor-pointer ml-2'
            onClick={requestLooksrare}
          >
            Approve
          </span>
      }
    </div>
    <div>
        opensea:{' '}
      {
        openseaAllowed ?
          <span
            className='text-link hover:underline cursor-pointer ml-2'
            onClick={async () => {
              const parameters: SeaportOrderParameters = createSeaportParametersForNFTListing(
                account?.address,
                props.nft,
                ethers.utils.parseEther('10'),
                NULL_ADDRESS, // currency (ETH)
              );
              const signature = await signOrderForSeaport(parameters, seaportCounter);
              const result = await listSeaport(signature , { ...parameters, counter: seaportCounter });
              if (result) {
                mutateListings();
              }
            }}
          >
            List Now
          </span> :
          <span
            className='text-link hover:underline cursor-pointer ml-4'
            onClick={requestOpensea}
          >
            Approve
          </span>
      }
    </div>
  </div>;
}