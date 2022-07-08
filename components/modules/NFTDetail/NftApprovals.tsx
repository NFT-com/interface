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
import { deductFees, feeToConsiderationItem, generateRandomSalt } from 'utils/seaportHelpers';

import { Addresses,addressesByNetwork, MakerOrder } from '@looksrare/sdk';
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
                const protocolFees = await looksrareStrategy.viewProtocolFee();
                const [
                  , // setter
                  , // receiver
                  fee
                ]: [string, string, BigNumber] = await looksrareRoyaltyFeeRegistry.royaltyFeeInfoCollection(props.nft?.contract);
                const nonce: number = await getLooksrareNonce(account?.address);
                // Get protocolFees and creatorFees from the contracts
                const netPriceRatio = BigNumber.from(10000).sub(protocolFees.add(fee)).toNumber();
                // This variable is used to enforce a max slippage of 25% on all orders, if a collection change the fees to be >25%, the order will become invalid
                const minNetPriceRatio = 7500;
                const order: MakerOrder = {
                  nonce,
                  tokenId: BigNumber.from(props.nft?.tokenId).toString(),
                  collection: props.nft?.contract,
                  strategy: addresses.STRATEGY_STANDARD_SALE,
                  currency: addresses.WETH,
                  signer: account?.address,
                  isOrderAsk: true,
                  amount: '1',
                  price:  ethers.utils.parseEther('10').toString(),
                  startTime: BigNumber.from(Date.now()).div(1000).toString(),
                  endTime: BigNumber.from(Date.now()).div(1000).add(604800 /* 1 week in seconds */).toString(),
                  minPercentageToAsk: Math.max(netPriceRatio, minNetPriceRatio),
                  params: []
                };
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