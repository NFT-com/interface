import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import CustomTooltip2 from 'components/elements/CustomTooltip2';
import LikeCount from 'components/elements/LikeCount';
import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { NFTPurchasesContext } from 'components/modules//Checkout/NFTPurchaseContext';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { DetailedNft } from 'components/modules/DiscoveryCards/CollectionCard';
import { getAddressForChain, nftAggregator, nftProfile } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { AuctionType, LooksrareProtocolData, NftcomProtocolData, SeaportProtocolData, TxActivity, X2Y2ProtocolData } from 'graphql/generated/types';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useGetCurrentDate } from 'hooks/useGetCurrentDate';
import { useGetERC20ProtocolApprovalAddress } from 'hooks/useGetERC20ProtocolApprovalAddress';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getListingCurrencyAddress, getListingEndDate, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import GK from 'public/Badge_Key.svg';
import ETH from 'public/eth.svg';
import ETHBlack from 'public/eth-black.svg';
import Hidden from 'public/Hidden.svg';
import LooksrareIcon from 'public/looksrare-icon.svg';
import NFTLogo from 'public/nft_logo_yellow.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import Reorder from 'public/Reorder.svg';
import ShopIcon from 'public/shop-icon.svg';
import USDC from 'public/usdc.svg';
import Visible from 'public/Visible.svg';
import X2Y2Gray from 'public/x2y2_gray.svg';
import { MouseEvent, useCallback, useContext, useMemo } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';
export interface NftCardProps {
  name: string;
  images: Array<string | null>;
  collectionName: string;
  contractAddr: string;
  tokenId: string;
  redirectTo: string;
  
  listings?: PartialDeep<TxActivity>[];
  nft?: PartialDeep<DetailedNft>;
  isOwnedByMe?: boolean;
  visible?: boolean | null;
  onVisibleToggle?: (visible: boolean) => void;
  onClick?: () => void;
  descriptionVisible?: boolean;
  preventDefault?: boolean;
}

export function NFTCard(props: NftCardProps) {
  const { stagePurchase, stageBuyNow, togglePurchaseSummaryModal } = useContext(NFTPurchasesContext);
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  const { address: currentAddress } = useAccount();
  const { getByContractAddress } = useSupportedCurrencies();
  const defaultChainId = useDefaultChainId();
  const currentDate = useGetCurrentDate();
  const chainId = useDefaultChainId();
  const ethPriceUSD = useEthPriceUSD();

  const { data: nft } = useNftQuery(props.contractAddr, (props?.listings?.length || props?.nft) ? null : props.tokenId); // skip query if listings are passed, or if nft is passed by setting tokenId to null
  const { profileData: nftProfileData } = useProfileQuery(!props?.nft || props?.contractAddr === getAddressForChain(nftProfile, defaultChainId) ? props.name : null); // skip query if nfts is passed by setting null
  const processedImageURLs = sameAddress(props.contractAddr, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images.length > 0 ? props.images?.map(processIPFSURL) : [nft?.metadata?.imageURL].map(processIPFSURL);

  const isOwnedByMe = props?.isOwnedByMe || (nft?.wallet?.address ?? nft?.owner) === currentAddress;
  const bestListing = getLowestPriceListing(filterValidListings(props.listings ?? nft?.listings?.items), ethPriceUSD, chainId);
  const listingCurrencyData = getByContractAddress(getListingCurrencyAddress(bestListing));
  const getERC20ProtocolApprovalAddress = useGetERC20ProtocolApprovalAddress();
  
  const nftImage = document.getElementsByClassName('nftImg')[0]?.clientWidth; // ?????????

  const checkEndDate = () => {
    if(bestListing){
      const endDate = moment.unix(getListingEndDate(bestListing, bestListing.order.protocol as ExternalProtocol));
      const date = moment(endDate).fromNow();

      if(date.includes('minute') || date.includes('second')){
        return 'less than 1 hour';
      } else return date.replace('in ', '');
    }
  };

  const getIcon = useCallback((contract: string, currency: string) => {
    switch (currency) {
    case 'ETH':
      return <ETHBlack className='-ml-1 mr-1 h-4 w-4 relative shrink-0 grayscale' alt="ETH logo redirect" layout="fill"/>;
    case 'USDC':
      return <USDC className='-ml-1 mr-1 h-4 w-4 relative shrink-0' alt="USDC logo redirect" layout="fill"/>;
    case 'WETH':
      return <ETH className='-ml-1 mr-1 h-4 w-4 relative shrink-0' alt="ETH logo redirect" layout="fill"/>;
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

  const showListingIcons: boolean = useMemo(() => {
    return !isNullOrEmpty(filterValidListings(props?.listings || nft?.listings?.items));
  }, [props, nft]);

  const showOpenseaListingIcon: boolean = useMemo(() => {
    return filterValidListings(props?.listings || nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.Seaport) != null;
  }, [props, nft]);

  const showLooksrareListingIcon: boolean = useMemo(() => {
    return filterValidListings(props?.listings || nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.LooksRare) != null;
  }, [props, nft]);

  const showNftcomListingIcon: boolean = useMemo(() => {
    return filterValidListings(props?.listings || nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.NFTCOM) != null;
  }, [props, nft]);

  const showX2Y2ListingIcon: boolean = useMemo(() => {
    return filterValidListings(props?.listings || nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.X2Y2) != null;
  }, [props, nft]);

  return (
    <div className='relative w-full h-full'>
      {props?.visible !== true && props?.visible !== false &&
       <div className='absolute top-4 right-4 z-50'>
         <LikeCount count={10} isLiked={false} onClick={() => null} />
       </div>
      }
      
      <div className={tw(
        'group/ntfCard transition-all cursor-pointer rounded-2xl shadow-xl cursor-p relative w-full h-full mb-3 minmd:mb-0 overflow-visible',
        props.descriptionVisible != false ? '' : 'h-max'
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
          <div className={tw(
            'relative object-cover w-full h-max flex flex-col',
            !bestListing && 'mb-10'
          )}>
            <div className={tw(
              `h-[${nftImage}px] object-cover overflow-hidden rounded-t-2xl`,
              props?.descriptionVisible === false && 'rounded-b-2xl'
            )}>
              <div className='group-hover/ntfCard:scale-110 hover:scale-105 transition'>
                <RoundedCornerMedia
                  variant={RoundedCornerVariant.None}
                  width={600}
                  height={600}
                  containerClasses='w-full h-full overflow-hidden'
                  src={processedImageURLs[0]}
                  extraClasses='hover:scale-105 transition'
                />
                <div className="group-hover/ntfCard:opacity-100 opacity-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.40)] absolute top-0">
                
                  {(props?.listings?.length || nft?.listings?.items?.length) && bestListing && !isOwnedByMe ?
                    <div className='w-full h-full relative'>
                      <div className='absolute top-7 left-7'>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            const currencyData = getByContractAddress(getListingCurrencyAddress(bestListing) ?? WETH.address);
                            const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
                            const protocolAllowance = await currencyData.allowance(currentAddress, getERC20ProtocolApprovalAddress(bestListing?.order?.protocol as ExternalProtocol));
                            const price = getListingPrice(bestListing);
                            stagePurchase({
                              nft: props?.nft || nft,
                              activityId: bestListing?.id,
                              currency: getListingCurrencyAddress(bestListing) ?? WETH.address,
                              price: price,
                              collectionName: props.collectionName,
                              protocol: bestListing?.order?.protocol as ExternalProtocol,
                              isERC20ApprovedForAggregator: BigNumber.from(allowance ?? 0).gt(price),
                              isERC20ApprovedForProtocol: BigNumber.from(protocolAllowance ?? 0).gt(price),
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
                          className="p-[11px] bg-footer-bg hover:bg-[#ECECEC] text-button-tertiary-hover rounded-[10px] h-10 w-10">
                          <ShopIcon/>
                        </button>
                      </div>
                      <div className='absolute bottom-7 left-7 flex flex-row w-full justify-between items-center pr-14'>
                        <p className='text-white text-sm font-noi-grotesk font-medium'>Available on</p>
                        {showListingIcons && (
                          <div className='flex flex-row'>
                            {showLooksrareListingIcon &&
                            <CustomTooltip2
                              noFullHeight={true}
                              orientation='top'
                              tooltipComponent={
                                <div
                                  className="w-max"
                                >
                                  <p>
                                    Buy Now
                                  </p>
                                </div>
                              }
                            >
                              <LooksrareIcon
                                className='h-8 w-8 relative shrink-0 grayscale'
                                alt="Looksrare logo redirect"
                                layout="fill"
                              />
                            </CustomTooltip2>
                            }
                            {showOpenseaListingIcon &&
                             <CustomTooltip2
                               noFullHeight={true}
                               orientation='top'
                               tooltipComponent={
                                 <div
                                   className="w-max"
                                 >
                                   <p>
                                     Buy Now
                                   </p>
                                 </div>
                               }
                             >
                               <OpenseaIcon
                                 className='h-8 w-8 relative shrink-0 grayscale'
                                 alt="Opensea logo redirect"
                                 layout="fill"
                               />
                             </CustomTooltip2>
                            }
                            {showX2Y2ListingIcon &&
                            <CustomTooltip2
                              noFullHeight={true}
                              orientation='top'
                              tooltipComponent={
                                <div
                                  className="w-max"
                                >
                                  <p>
                                    Buy Now
                                  </p>
                                </div>
                              }
                            >
                              <X2Y2Gray
                                className='h-[25px] w-[25px] relative shrink-0 ml-1 grayscale'
                                alt="Opensea logo redirect"
                                layout="fill"
                              />
                            </CustomTooltip2>
                            }
                            {showNftcomListingIcon &&
                            <CustomTooltip2
                              noFullHeight={true}
                              orientation='top'
                              tooltipComponent={
                                <div
                                  className="w-max"
                                >
                                  <p>
                                    Buy Now
                                  </p>
                                </div>
                              }
                            >
                              <NFTLogo
                                className='h-[25px] w-[25px] relative shrink-0 ml-1.5'
                                alt="NFT.com logo redirect"
                                layout="fill"
                              />
                            </CustomTooltip2>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                    : null }
                </div>
              </div>
            </div>

            {props.descriptionVisible != false &&
            <div className={tw(
              'sm:h-[auto] p-[18px] bg-white font-noi-grotesk',
              'h-max',
              'flex flex-row w-full max-w-full rounded-b-2xl'
            )}
            >
              <div
                className={tw(
                  'sm:leading-[18px]  flex flex-col text-xl leading-[28px] font-[600] list-none font-noi-grotesk',
                  'max-w-full w-full h-max'
                )}
              >
                <div className='flex w-full justify-between'>
                  <div className="p-0 m-[0] whitespace-nowrap text-ellipsis overflow-hidden flex mr-5">
                    <p className='whitespace-nowrap text-ellipsis overflow-hidden'>{props.name}</p>
                    {(props.nft?.isGKMinted ?? nftProfileData?.profile?.isGKMinted) &&
                        <div className='h-4 w-4 minlg:h-6 minlg:w-6 ml-2 min-w-[24px] flex items-center'>
                          <GK />
                        </div>
                    }
                  </div>
                  {
                    (props?.listings?.length || nft?.listings?.items?.length) && bestListing ?
                      <CustomTooltip2
                        noFullHeight={true}
                        orientation='top'
                        tooltipComponent={
                          <div
                            className="w-max"
                          >
                            <p>
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(listingCurrencyData?.usd(Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18))) ?? 0)}
                            </p>
                          </div>
                        }
                      >
                        <div className='hidden minmd:flex items-center text-base font-medium hover:bg-footer-bg hover:rounded-full py-1 px-2 -mr-2 -mt-1 '>
                          {getIcon(
                            listingCurrencyData?.contract,
                            listingCurrencyData?.name ?? 'WETH',
                          )}
                          {listingCurrencyData?.decimals ? Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)).toLocaleString(undefined, { maximumSignificantDigits: 3 }) : '-'}
                      &nbsp;
                          {listingCurrencyData?.name ?? 'WETH'}
                        </div>
                      </CustomTooltip2>
                      : null
                  }
                </div>
                <div className='flex w-full flex-row justify-between items-center'>
                  <p
                    className={tw(
                      'sm:text-sm text-base leading-[25.5px] text-[#6A6A6A] mt-1 font-[400] list-none p-0 m-[0] whitespace-nowrap text-ellipsis overflow-hidden'
                    )}
                  >
                    {props.collectionName}
                  </p>
                  {(props?.listings?.length || nft?.listings?.items?.length) && bestListing ?
                    <p className="text-[#B2B2B2] font-normal text-sm mt-1 whitespace-nowrap ml-5 hidden minmd:block">
                      Ends in
                      <span className='text-[#6A6A6A] font-medium'> {checkEndDate()}</span>
                    </p>
                    : null
                  }
                </div>
                <div className='flex minmd:hidden justify-between mt-4'>
                  {(props?.listings?.length || nft?.listings?.items?.length) && bestListing ?
                    <>
                      <p className="text-[#B2B2B2] font-normal text-sm mt-1 whitespace-nowrap">
                      Ends in
                        <span className='text-[#6A6A6A] font-medium'> {checkEndDate()}</span>
                      </p>
                      <CustomTooltip2
                        noFullHeight={true}
                        orientation='top'
                        tooltipComponent={
                          <div
                            className="w-max"
                          >
                            <p>
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol' }).format(listingCurrencyData?.usd(Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18))) ?? 0)}
                            </p>
                          </div>
                        }
                      >
                        <div className='items-center text-base font-medium hover:bg-footer-bg hover:rounded-full py-1 px-2 -mr-2 -mt-1 flex'>
                          {getIcon(
                            listingCurrencyData?.contract,
                            listingCurrencyData?.name ?? 'WETH',
                          )}
                          {listingCurrencyData?.decimals ? Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)).toLocaleString(undefined, { maximumSignificantDigits: 3 }) : '-'}
                   &nbsp;
                          {listingCurrencyData?.name ?? 'WETH'}
                        </div>
                      </CustomTooltip2>
                    </>
                    : null
                  }
                </div>
              </div>
            </div>
            }
            {(props?.listings?.length || nft?.listings?.items?.length) && bestListing && props?.descriptionVisible !== false ?
              bestListing?.order?.protocol === ExternalProtocol.NFTCOM && (bestListing?.order?.protocolData as NftcomProtocolData)?.auctionType === AuctionType.English ?
                <div className='w-full overflow-hidden rounded-b-2xl'>
                  <div className='-ml-2 -mr-2'>
                    <Button stretch label='Make an offer' type={ButtonType.SECONDARY} size={ButtonSize.LARGE}
                      onClick={() => null} />
                  </div>
                </div>
                :
                <div className='w-full overflow-hidden rounded-b-2xl'>
                  <div className='-ml-2 -mr-2'>
                    <Button stretch label='Buy Now' type={ButtonType.PRIMARY} size={ButtonSize.LARGE}
                      onClick={async (e) => {
                        e.preventDefault();
                        const currencyData = getByContractAddress(getListingCurrencyAddress(bestListing) ?? WETH.address);
                        const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
                        const protocolAllowance = await currencyData.allowance(currentAddress, getERC20ProtocolApprovalAddress(bestListing?.order?.protocol as ExternalProtocol));
                        const price = getListingPrice(bestListing, (bestListing?.order?.protocolData as NftcomProtocolData).auctionType === AuctionType.Decreasing ? currentDate : null);
                        const protocol = bestListing?.order?.protocol as ExternalProtocol;
                        stageBuyNow({
                          nft: props?.nft || nft,
                          activityId: bestListing?.id,
                          currency: getListingCurrencyAddress(bestListing) ?? WETH.address,
                          price: price,
                          collectionName: props.collectionName,
                          protocol: protocol,
                          isERC20ApprovedForAggregator: BigNumber.from(allowance ?? 0).gt(price),
                          isERC20ApprovedForProtocol: BigNumber.from(protocolAllowance ?? 0).gt(price),
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
                    />
                  </div>
                </div>
              : null
            }
          </div>
        </a>
      </div>
    </div>
  );
}
