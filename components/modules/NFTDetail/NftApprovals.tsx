import { NULL_ADDRESS } from 'constants/addresses';
import { Nft } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useSeaportCounter } from 'hooks/useSeaportCounter';
import { useSignSeaportOrder } from 'hooks/useSignSeaportOrder';
import { listSeaport } from 'utils/listings';
import { deductFees, feeToConsiderationItem, generateRandomSalt } from 'utils/seaportHelpers';

import { BigNumber, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';
import {
  Fee,
  ItemType,
  OPENSEA_CONDUIT_KEY,
  OrderType,
  SEAPORT_FEE_COLLLECTION_ADDRESS,
  SEAPORT_ZONE,SEAPORT_ZONE_HASH,
  SeaportOrderParameters
} from 'types';
import { useAccount } from 'wagmi';

export interface NFTApprovalsProps {
  nft: PartialDeep<Nft>;
}

export function NftApprovals(props: NFTApprovalsProps) {
  const { data: account } = useAccount();
  const counter = useSeaportCounter(account?.address);
  const signOrder = useSignSeaportOrder();
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
        looksrare:
      {
        looksRareAllowed ?
          <>
            <span>approved!</span>
            <span
              className='text-link hover:underline cursor-pointer ml-2'
              onClick={() => {
                // todo: call to /api/looksrare to list
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
              const salePriceWei: BigNumber = ethers.utils.parseEther('10');
              const saleCurrencyAddress = NULL_ADDRESS;
              // This is what the seller will accept for their NFT.
              // For now, we support a single currency.
              const considerationItems = [{
                itemType: ItemType.NATIVE,
                token: saleCurrencyAddress,
                identifierOrCriteria: BigNumber.from(0).toString(),
                startAmount: salePriceWei.toString(),
                endAmount: salePriceWei.toString(),
                recipient: account?.address,
              }];
              const openseaFee: Fee = {
                recipient: SEAPORT_FEE_COLLLECTION_ADDRESS,
                basisPoints: 250,
              };
              
              const parameters: SeaportOrderParameters = {
                offerer: account?.address ?? NULL_ADDRESS,
                zone: SEAPORT_ZONE,
                offer: [{
                  itemType: ItemType.ERC721,
                  token: props.nft?.contract,
                  identifierOrCriteria: BigNumber.from(props.nft?.tokenId).toString(),
                  startAmount: BigNumber.from(1).toString(),
                  endAmount: BigNumber.from(1).toString(),
                }],
                consideration: [
                  ...deductFees(considerationItems, [openseaFee]),
                  feeToConsiderationItem({
                    fee: openseaFee,
                    token: saleCurrencyAddress,
                    baseAmount: salePriceWei,
                  })
                ],
                orderType: OrderType.FULL_RESTRICTED,
                startTime: BigNumber.from(Date.now()).div(1000).toString(),
                endTime: BigNumber.from(Date.now()).div(1000).add(604800 /* 1 week in seconds */).toString(),
                zoneHash: SEAPORT_ZONE_HASH,
                totalOriginalConsiderationItems: '2',
                salt: generateRandomSalt(),
                conduitKey: OPENSEA_CONDUIT_KEY,
              };
              console.log(parameters);
              const signature = await signOrder(parameters, counter);
              const result = await listSeaport(signature , { ...parameters, counter });
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