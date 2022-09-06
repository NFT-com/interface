import { SupportedExternalExchange } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { ExternalProtocol } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { getOpenseaAssetPageUrl } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import { BigNumber } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { CheckSquare, Eye, EyeOff, Square } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';
export interface NFTCardTrait {
  key: string,
  value: string,
}

export interface NFTCardProps {
  title: string;
  subtitle?: string;
  cta?: string;
  contractAddress?: string;
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
  const { tileBackground, secondaryText, pink, link, secondaryIcon } = useThemeColors();

  const { address: currentAddress } = useAccount();
  const defaultChainId = useDefaultChainId();
  const [selected, setSelected] = useState(false);

  const processedImageURLs = sameAddress(props.contractAddress, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images?.map(processIPFSURL);

  const { data: listings } = useListingActivitiesQuery(
    props?.contractAddress,
    props?.tokenId,
    defaultChainId
  );
  
  const { data: legacyListings } = useExternalListingsQuery(
    props?.contractAddress,
    props?.tokenId,
    defaultChainId
  );

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
        `drop-shadow-md rounded-2xl flex flex-col ${ props.nftsDescriptionsVisible != false ? 'h-full' : 'h-max'}`,
        props.constrain ?
          // constrain self to 2 or 4 per row
          'w-2/5 minlg:w-[23%]' :
          'w-full min-h-[inherit]',
        props.customBorder ?? '',
        'cursor-pointer transform hover:scale-105',
        'overflow-hidden',
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
            className='absolute right-3 top-4'
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
                  variant={RoundedCornerVariant.None}
                  containerClasses='w-1/3'
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
      {props.nftsDescriptionsVisible != false && <div className="p-3 minlg:p-4 flex flex-col">
        <span className={tw(
          ' text-base minmd:text-lg minlg:text-xl minxl:text-2xl font-semibold truncate',
          isNullOrEmpty(props.title) ?
            'text-secondary-txt' :
            props.lightModeForced ? 'text-primary-txt':'text-primary-txt dark:text-primary-txt-dk'
        )}>
          {isNullOrEmpty(props.title) ? 'Unknown Name' : props.title}
        </span>
        {props.subtitle && <span
          className='text-xs minmd:text-sm  text-secondary-txt mt-2 text-ellipsis overflow-hidden'
        >
          {props.subtitle}
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
      </div>}
    </div>
  );
}