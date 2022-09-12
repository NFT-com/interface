import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, SeaportProtocolData, SupportedExternalExchange } from 'graphql/generated/types';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getListingCurrencyAddress, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { getOpenseaAssetPageUrl } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { RoundedCornerAmount,RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import { BigNumber, ethers } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { MouseEvent, useCallback, useContext, useMemo, useState } from 'react';
import { CheckSquare, Eye, EyeOff, Square } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';
export interface NFTCardTrait {
  key: string,
  value: string,
}

export interface NFTCardProps {
  title: string;
  cta?: string;
  contractAddress?: string;
  collectionName?: string;
  tokenId?: string;
  header?: NFTCardTrait;
  traits?: NFTCardTrait[];
  description?: string;
  profileURI?: string;
  images: Array<string | null>;
  onClick: () => void;
  onSelectToggle?: (selected: boolean) => void;
  visible?: boolean;
  onVisibleToggle?: (visible: boolean) => void;

  // By default this component takes the full width of its container.
  // If you need this component to constrain its own width, use this prop.
  // The result of this is not guaranteed, and the recommended approach is to
  // wrap this in a container with a specified width.
  constrain?: boolean;
  customBackground?: string;
  customBorderRadius?: string;
  imageLayout?: 'row' | 'grid';
  nftsDescriptionsVisible?: boolean;
  customBorder?: string;
  lightModeForced?: boolean;
  layoutType?: string
}

export function NFTCard(props: NFTCardProps) {
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddress, props.tokenId);
  const { data: collectionData } = useCollectionQuery(defaultChainId, props.contractAddress);
  const { tileBackground, secondaryText, pink, secondaryIcon, link } = useThemeColors();
  const { address: currentAddress } = useAccount();
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const [selected, setSelected] = useState(false);
  const ethPriceUsd: number = useEthPriceUSD();

  const processedImageURLs = sameAddress(props.contractAddress, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images?.map(processIPFSURL);
  
  const variantsForRow: RoundedCornerVariant[] = useMemo(() => {
    if (processedImageURLs.length > 2) {
      return [
        RoundedCornerVariant.Left,
        RoundedCornerVariant.None,
        RoundedCornerVariant.Right,
      ];
    } else if (processedImageURLs.length === 2) {
      return [
        RoundedCornerVariant.Left,
        RoundedCornerVariant.Right,
      ];
    } else {
      return [
        RoundedCornerVariant.All,
      ];
    }
  }, [processedImageURLs.length]);

  const { data: listings } = useListingActivitiesQuery(
    props?.contractAddress,
    props?.tokenId,
    defaultChainId,
    nft?.wallet?.address
  );
  
  const { data: legacyListings } = useExternalListingsQuery(
    props?.contractAddress,
    props?.tokenId,
    defaultChainId
  );

  const lowestListing = getLowestPriceListing(listings, ethPriceUsd, defaultChainId);
  const lowestPrice = getListingPrice(lowestListing);
  const makeTrait = useCallback((pair: NFTCardTrait, key: any) => {
    return <div key={key} className="flex mt-2">
      <span className='text-xs minmd:text-sm' style={{ color: pink }}>
        {pair.key}{isNullOrEmpty(pair.key) ? '' : ' '}
      </span>
      <span
        className='text-xs minmd:text-sm ml-1'
        style={{ color: secondaryText }}
      >
        {pair.value}
      </span>
    </div>;
  }, [pink, secondaryText]);

  const showListingIcons: boolean = useMemo(() => {
    if (getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
      return !isNullOrEmpty(listings);
    } else {
      return !isNullOrEmpty(legacyListings?.filter((l) => !isNullOrEmpty(l.url)));
    }
  }, [legacyListings, listings]);

  const showOpenseaListingIcon: boolean = useMemo(() => {
    if (getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
      return listings?.find(activity => activity.order?.protocol === ExternalProtocol.Seaport) != null;
    } else {
      return legacyListings?.find(listing => listing.price != null && listing.exchange === SupportedExternalExchange.Opensea) != null;
    }
  }, [listings, legacyListings]);

  const showLooksrareListingIcon: boolean = useMemo(() => {
    if (getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
      return listings?.find(activity => activity.order?.protocol === ExternalProtocol.LooksRare) != null;
    } else {
      return legacyListings?.find(listing => listing.price != null && listing.exchange === SupportedExternalExchange.Looksrare) != null;
    }
  }, [legacyListings, listings]);

  return (
    <div
      className={tw(
        `drop-shadow-md rounded flex flex-col ${ props.nftsDescriptionsVisible != false ? 'h-full' : 'h-max'}`,
        props.imageLayout === 'row' ? 'p-3 rounded-xl' : 'p-2 rounded',
        props.constrain ?
          // constrain self to 2 or 4 per row
          'w-2/5 minlg:w-[23%]' :
          'w-full min-h-[inherit]',
        props.customBorder ?? '',
        'cursor-pointer transform hover:scale-105',
        'overflow-hidden',
        'border border-[#D5D5D5]'
      )}
      style={{
        backgroundColor: props.customBackground ?? tileBackground
      }}
      onClick={() => {
        // TODO: move to helper / logger class at some point
        analytics.track(`${props?.visible ? 'Hide' : 'Show'} Single NFT`, {
          ethereumAddress: currentAddress,
          title: props?.title,
          processedImageURLs: processedImageURLs?.[0],
          profile: props?.profileURI,
        });

        props.onClick();
      }}
    >
      {(props.header || props.onSelectToggle != null) &&
        <div className='flex w-full px-4 minlg:px-5 pt-4 minlg:pt-5 pb-2 minlg:pb-3  justify-between'>
          <div className='flex flex-col'>
            <span className='text-xs text-secondary-txt font-semibold'>
              {props.header?.key ?? ''}
            </span>
            <span
              className='text-xs minmd:text-sm  font-bold text-primary-txt dark:text-primary-txt-dk'
            >
              {props.header?.value ?? ''}
            </span>
          </div>
          {
            props.onSelectToggle != null &&
            <div
              className='p-1'
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                setSelected(!selected);
                props.onSelectToggle(selected);
                e.stopPropagation();
              }}>
              {selected ? <CheckSquare color={secondaryIcon} /> : <Square color={secondaryIcon} />}
            </div>
          }
        </div>
      }
      {
        props.visible != null &&
          <div
            className='absolute right-3 top-4 z-50'
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              props.onVisibleToggle(!props.visible);
              e.stopPropagation();
            }}
          >
            {props.visible ? <Eye id="eye" color={pink} /> : <EyeOff id="eyeOff" color={pink} /> }
          </div>
      }
      {showListingIcons && (
        <div className='absolute left-3 top-4 z-50'>
          {showOpenseaListingIcon &&
              <OpenseaIcon
                onClick={(e: MouseEvent<any>) => {
                  window.open(
                    getOpenseaAssetPageUrl(props.contractAddress, BigNumber.from(props.tokenId).toString()),
                    '_blank'
                  );
                  e.stopPropagation();
                }}
                className='h-9 w-9 relative shrink-0 hover:opacity-70 '
                alt="Opensea logo redirect"
                layout="fill"
              />
          }
          {showLooksrareListingIcon &&
              <LooksrareIcon
                onClick={(e: MouseEvent<any>) => {
                  window.open(
                    getLooksrareAssetPageUrl(props.contractAddress, BigNumber.from(props.tokenId).toString()),
                    '_blank'
                  );
                  e.stopPropagation();
                }}
                className='h-9 w-9 relative shrink-0 hover:opacity-70'
                alt="Looksrare logo redirect"
                layout="fill"
              />
          }
        </div>
      )}
      {
        props.images.length <= 1 && props.imageLayout !== 'row' ?
          <div
            className={tw(
              'w-full overflow-hidden aspect-square',
              props.nftsDescriptionsVisible != false ? 'bg-[#F0F0F0]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'LargeMosaicLargeCard' ? 'h-[592px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'LargeMosaicSmallCard' ? 'h-[133px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'LargeMosaicMediumCard' ? 'h-[363px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'MediumMosaicSmallCard' ? 'h-[181px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'MediumMosaicMediumCard' ? 'h-[456px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'SmallMosaicSmallCard' ? 'h-[157px]' : '',
              props.nftsDescriptionsVisible != false && props.layoutType === 'SmallMosaicMediumCard' ? 'h-[397px]' : '',
              props.customBorderRadius ?? 'rounded-3xl',
              props.images[0] == null ? 'aspect-square' : '',
            )}
          >
            { props.images.length === 0 || props.images[0] == null ?
              null :
              <RoundedCornerMedia
                containerClasses='w-full h-full'
                variant={RoundedCornerVariant.None}
                src={processedImageURLs[0]}
              />}
          </div> :
          props.imageLayout === 'row' ?
            <div className='flex justify-center w-full min-h-XL min-h-2XL'>
              {processedImageURLs.slice(0,3).map((image: string, index: number) => {
                return <RoundedCornerMedia
                  key={image + index}
                  src={image}
                  variant={variantsForRow[index]}
                  containerClasses='w-1/3'
                  amount={RoundedCornerAmount.Medium}
                />;
              })}
            </div> :
            <div className="grid grid-cols-2">
              {processedImageURLs.slice(0, 4).map((image: string, index: number) => {
                return <RoundedCornerMedia
                  key={image + index}
                  src={image}
                  variant={RoundedCornerVariant.None}
                  extraClasses='w-full rounded-3xl overflow-hidden'
                />;
              })}
            </div>
      }
      {props.nftsDescriptionsVisible != false && <div className="flex flex-col">
        {props.imageLayout !== 'row' && <span className={tw(
          'text-[#6F6F6F] text-sm pt-[10px]'
        )}>
          {isNullOrEmpty(props.collectionName) && isNullOrEmpty(collectionData?.collection?.name) ? 'Unknown Name' : isNullOrEmpty(props.collectionName) ? collectionData?.collection?.name : props.collectionName}
        </span>}
        {props.title && <span
          className={`whitespace-nowrap text-ellipsis overflow-hidden font-medium ${props.imageLayout === 'row' ? 'pt-[10px]' : ''}`}
        >
          {props.title}
        </span>}
        {(props.traits ?? []).map((pair, index) => makeTrait(pair, index))}
 
        {!isNullOrEmpty(props.description) && (
          <div className='mt-4 text-secondary-txt text-xs minmd:text-sm'>
            {props.description}
          </div>
        )}
        {
          props.cta &&
            <div
              className="mt-4 text-xs minmd:text-sm cursor-pointer hover:underline"
              style={{ color: link }}
            >
              {props.cta}
            </div>
        }

        {showListingIcons && !nft?.isOwnedByMe && getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
          <div className='flex flex-col minmd:flex-row flex-wrap mt-3 justify-between'>
            <div className='flex flex-col pr-2'>
              <p className='text-[#6F6F6F] text-sm'>Lowest Price</p>
              <p className='font-medium'>
                {lowestPrice && ethers.utils.formatEther(lowestPrice)}
                {' '}
                {lowestListing && getByContractAddress(getListingCurrencyAddress(lowestListing) ?? WETH.address).name}
              </p>
            </div>
            <div>
              <button onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                const listing = lowestListing;
                const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
                const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, defaultChainId));
                const price = getListingPrice(listing);
                stagePurchase({
                  nft: nft,
                  activityId: listing?.id,
                  currency: getListingCurrencyAddress(listing) ?? WETH.address,
                  price: price,
                  collectionName: props.collectionName,
                  protocol: listing?.order?.protocol as ExternalProtocol,
                  isApproved: BigNumber.from(allowance ?? 0).gt(price),
                  protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
                    listing?.order?.protocolData as SeaportProtocolData :
                    listing?.order?.protocolData as LooksrareProtocolData
                });
                toggleCartSidebar('Buy');
              }}
              className="bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-2 px-5 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                Add to cart
              </button>
            </div>
          </div>
        }
      </div>}
    </div>
  );
}
