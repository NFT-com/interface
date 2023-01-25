import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NFTPurchasesContext } from 'components/modules//Checkout/NFTPurchaseContext';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, SeaportProtocolData, TxActivity, X2Y2ProtocolData } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getListingCurrencyAddress, getListingEndDate, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { DetailedNft } from './CollectionCard';

import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import ETH from 'public/eth.svg';
import Hidden from 'public/Hidden.svg';
import Reorder from 'public/Reorder.svg';
import ShopIcon from 'public/shop-icon.svg';
import USDC from 'public/usdc.svg';
import Visible from 'public/Visible.svg';
import { MouseEvent, useCallback, useContext } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';
export interface NftCardProps {
  name: string;
  images?: Array<string | null>;
  collectionName: string;
  redirectTo?: string;
  description?: string;
  customBackground?: string;
  contractAddr?: string;
  lightModeForced?: boolean;
  listings?: PartialDeep<TxActivity>[];
  nft?: PartialDeep<DetailedNft>;
  price?: string;
  secondPrice?: string;
  ednDay?: string;
  tokenId?: string;
  isOnSale?: boolean;
  isOwnedByMe?: boolean;
  visible?: boolean;
  onVisibleToggle?: (visible: boolean) => void;
  onClick?: () => void;
  nftsDescriptionsVisible?: boolean;
  preventDefault?: boolean;
  fallbackImage?: string;
}

export function NftCard(props: NftCardProps) {
  const newFiltersEnabled = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE3_ENABLED);

  const { stagePurchase, stageBuyNow, togglePurchaseSummaryModal } = useContext(NFTPurchasesContext);
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const { getByContractAddress } = useSupportedCurrencies();
  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings?.length || props?.nft) ? null : props.tokenId); // skip query if listings are passed, or if nfts is passed by setting tokenId to null
  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images.length > 0 ? props.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);
  const isOwnedByMe = props?.isOwnedByMe || nft?.wallet?.address === currentAddress;

  const chainId = useDefaultChainId();
  const ethPriceUSD = useEthPriceUSD();
  const bestListing = getLowestPriceListing(filterValidListings(props.listings ?? nft?.listings?.items), ethPriceUSD, chainId);
  const listingCurrencyData = getByContractAddress(getListingCurrencyAddress(bestListing));

  const checkEndDate = () => {
    if(bestListing){
      const endDate = moment.unix(getListingEndDate(bestListing, bestListing.order.protocol as ExternalProtocol));
      const date = moment(endDate).fromNow();

      if(date.includes('minute') || date.includes('second')){
        return 'less than 1 hour';
      } else return date;
    }
  };

  const nftImage = document.getElementsByClassName('nftImg')[0]?.clientWidth;

  const getIcon = useCallback((contract: string, currency: string) => {
    switch (currency) {
    case 'ETH':
      return <ETH className='-ml-1 mr-1 h-4 w-4 relative shrink-0' alt="ETH logo redirect" layout="fill"/>;
    case 'USDC':
      return <USDC className='-ml-1 mr-1 h-4 w-4 relative shrink-0' alt="USDC logo redirect" layout="fill"/>;
    default:
      if (!contract) {
        return <div>{currency}</div>;
      }
      // eslint-disable-next-line @next/next/no-img-element
      return <div className='-ml-1 mr-1 flex items-center'><img
        className='h-5 w-5 relative shrink-0'
        src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(contract)}/logo.png`}
        alt={currency}
      />
      </div>;
    }
  }, []);

  return (
    <div className={tw(
      'group/ntfCard transition-all cursor-pointer rounded-[16px] shadow-xl overflow-hidden cursor-p relative w-full mb-3',
      props.nftsDescriptionsVisible != false ? `${newFiltersEnabled ? '' : 'h-[442px] sm:h-[auto]'}` : 'h-max'
    )}>
      {
        props.visible != null &&
          <div
            className='absolute left-3 top-4 z-30'
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              props.onVisibleToggle(!props.visible);
              e.stopPropagation();
              props.preventDefault && e.preventDefault();
            }}
          >
            {props.visible
              ? <Visible className={tw(
                'w-7 h-6 fill-white'
              )} />
              : <Hidden className={tw(
                'w-7 h-6 fill-white'
              )} />
            }
          </div>
      }

      {
        props.visible === true &&
          <div
            className='absolute right-3 top-4 z-30'
          >
            <Reorder
              className={tw(
                'w-6 h-6'
              )}
            />
          </div>
      }
      <a
        href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'}
        onClick={(e) => {
        // TODO: move to helper / logger class at some point
          e.stopPropagation();
          props.preventDefault && e.preventDefault();
          analytics.track(`${props?.visible ? 'Hide' : 'Show'} Single NFT`, {
            ethereumAddress: currentAddress,
            title: props?.name,
            processedImageURLs: processedImageURLs?.[0]
          });

          props.onClick && props.onClick();
        }}
      >
        <div className={`${newFiltersEnabled ? '' : 'h-[252px]'} relative object-cover w-full`}>
          <div className={newFiltersEnabled ? `h-[${nftImage}px] object-cover overflow-hidden` : 'sm:h-[171px] relative h-[252px] object-cover overflow-hidden'}>
            <div className={`${newFiltersEnabled ? '' : 'h-[252px]'} group-hover/ntfCard:scale-110 hover:scale-105 transition `}>
              <RoundedCornerMedia
                variant={RoundedCornerVariant.None}
                width={600}
                height={600}
                containerClasses='w-full h-full overflow-hidden'
                src={processedImageURLs[0]}
                extraClasses='hover:scale-105 transition'
              />
              <div className="group-hover/ntfCard:opacity-100 opacity-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.40)] absolute top-0">
                <div className="absolute bottom-[24.5px] flex flex-row justify-center w-[100%]">
                  {(props?.listings?.length || nft?.listings?.items?.length) && bestListing && !isOwnedByMe && (hasGks || getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED)) ?
                    <>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const currencyData = getByContractAddress(getListingCurrencyAddress(bestListing) ?? WETH.address);
                          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
                          const price = getListingPrice(bestListing);
                          stageBuyNow({
                            nft: props?.nft || nft,
                            activityId: bestListing?.id,
                            currency: getListingCurrencyAddress(bestListing) ?? WETH.address,
                            price: price,
                            collectionName: props.collectionName,
                            protocol: bestListing?.order?.protocol as ExternalProtocol,
                            isApproved: BigNumber.from(allowance ?? 0).gt(price),
                            orderHash: bestListing?.order?.orderHash,
                            makerAddress: bestListing?.order?.makerAddress,
                            takerAddress: bestListing?.order?.takerAddress,
                            nonce: bestListing?.order?.nonce,
                            protocolData: bestListing?.order?.protocol === ExternalProtocol.Seaport ?
                              bestListing?.order?.protocolData as SeaportProtocolData :
                              bestListing?.order?.protocol === ExternalProtocol.X2Y2 ?
                                bestListing?.order?.protocolData as X2Y2ProtocolData:
                                bestListing?.order?.protocolData as LooksrareProtocolData
                          });
                          togglePurchaseSummaryModal();
                        }}
                        className="sm:text-sm mx-[7px] px-[16px] py-[8px] bg-[#F9D54C] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500] hover:bg-black  hover:text-[#F9D54C] "
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const currencyData = getByContractAddress(getListingCurrencyAddress(bestListing) ?? WETH.address);
                          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
                          const price = getListingPrice(bestListing);
                          stagePurchase({
                            nft: props?.nft || nft,
                            activityId: bestListing?.id,
                            currency: getListingCurrencyAddress(bestListing) ?? WETH.address,
                            price: price,
                            collectionName: props.collectionName,
                            protocol: bestListing?.order?.protocol as ExternalProtocol,
                            isApproved: BigNumber.from(allowance ?? 0).gt(price),
                            orderHash: bestListing?.order?.orderHash,
                            makerAddress: bestListing?.order?.makerAddress,
                            takerAddress: bestListing?.order?.takerAddress,
                            nonce: bestListing?.order?.nonce,
                            protocolData: bestListing?.order?.protocol === ExternalProtocol.Seaport ?
                              bestListing?.order?.protocolData as SeaportProtocolData :
                              bestListing?.order?.protocol === ExternalProtocol.X2Y2 ?
                                bestListing?.order?.protocolData as X2Y2ProtocolData:
                                bestListing?.order?.protocolData as LooksrareProtocolData
                          });
                          toggleCartSidebar('Buy');
                        }}
                        className="sm:text-sm mx-[7px] px-[16px] py-[8px] bg-[#ffffff] text-[#000000] rounded-[10px] text-[18px] leading-[24px] font-[500] hover:bg-[#F9D54C]">
                        <ShopIcon/>
                      </button>
                    </>
                    : null}
                </div>
              </div>
            </div>
          </div>

          {props.nftsDescriptionsVisible != false &&
            <div className="sm:h-[auto] h-[190px] p-[18px] bg-white font-noi-grotesk">
              <ul
                className="sm:leading-[18px] sm:h-[54px] h-[94px] flex flex-col text-[20px] leading-[28px] font-[600] list-none border-b-[1px] border-[#F2F2F2] pb-[8px] mb-[8px]">
                <li className="sm:text-[13px]	max-w-[200px] list-none p-0 m-[0] sm:whitespace-nowrap sm:text-ellipsis sm:overflow-hidden">{props.name}</li>
                <li
                  className="sm:text-sm text-[16px] [200px]  leading-[25.5px] text-[#6A6A6A] mt-[4px] font-[400] list-none p-0 m-[0] whitespace-nowrap text-ellipsis overflow-hidden">{props.collectionName}</li>
              </ul>
              {
                (props?.listings?.length || nft?.listings?.items?.length) && bestListing
                  ? (
                    <ul className="flex flex-col justify-between mt-[14px] font-noi-grotesk">
                      <li className="p-0 m-[0] flex flex-col">
                        <div>
                          <div className="font-noi-grotesk font-[500] text-[#000000] text-[16px] flex items-center">
                            <div className='flex items-center justify-between w-full'>
                              <div className="flex items-center">
                                {getIcon(
                                  listingCurrencyData?.contract,
                                  listingCurrencyData?.name ?? 'WETH',
                                )}
                                {listingCurrencyData?.decimals && ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)}
                                &nbsp;
                                {listingCurrencyData?.name ?? 'WETH'}
                              </div>
                              <span className="text-[#B2B2B2]">Ends in</span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="text-[14px] mt-1 p-0 m-[0] flex items-end justify-between font-noi-grotesk">
                        <span className='text-[#B2B2B2]'>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(listingCurrencyData?.usd(Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18))) ?? 0)}
                        </span>
                        <span className="text-[#6A6A6A] font-medium">{checkEndDate()}</span>
                      </li>
                    </ul>
                  )
                  : null
              }
            </div>
          }
        </div>
      </a>
    </div>
  );
}
