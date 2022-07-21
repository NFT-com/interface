import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Link from 'next/link';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { MouseEvent, useCallback, useState } from 'react';
import { CheckSquare, Eye, EyeOff, Square } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useNetwork } from 'wagmi';
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
}

export function NFTCard(props: NFTCardProps) {
  const { tileBackground, secondaryText, pink, link, secondaryIcon } = useThemeColors();

  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const [selected, setSelected] = useState(false);

  const processedImageURLs = sameAddress(props.contractAddress, getAddress('genesisKey', activeChain?.id ?? 1)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images?.map(processIPFSURL);

  const { data: listings } = useExternalListingsQuery(props?.contractAddress, props?.tokenId, String(activeChain?.id));
  const makeTrait = useCallback((pair: NFTCardTrait, key: any) => {
    return <div key={key} className="flex mt-2">
      <span className='text-sm sm:text-xs' style={{ color: pink }}>
        {pair.key}{isNullOrEmpty(pair.key) ? '' : ' '}
      </span>
      <span
        className='text-sm sm:text-xs ml-1'
        style={{ color: secondaryText }}
      >
        {pair.value}
      </span>
    </div>;
  }, [pink, secondaryText]);

  return (
    <div
      className={tw(
        'drop-shadow-md rounded-xl flex flex-col',
        props.constrain ?
          // constrain self to 2 or 4 per row
          'md:w-2/5 w-[23%]' :
          'w-full',
        'justify-between cursor-pointer transform hover:scale-105',
        'overflow-hidden',
      )}
      style={{
        backgroundColor: props.customBackground ?? tileBackground
      }}
      onClick={() => {
        // TODO: move to helper / logger class at some point
        analytics.track(`${props?.visible ? 'Hide' : 'Show'} Single NFT`, {
          ethereumAddress: account?.address,
          title: props?.title,
          processedImageURLs: processedImageURLs?.[0],
          profile: props?.profileURI,
        });

        props.onClick();
      }}
    >
      {(props.header || props.onSelectToggle != null) &&
        <div className='flex w-full px-5 md:px-4 pt-5 md:pt-4 pb-3 md:pb-2 justify-between'>
          <div className='flex flex-col'>
            <span className='text-xs text-secondary-txt font-semibold'>
              {props.header?.key ?? ''}
            </span>
            <span
              className='text-sm sm:text-xs font-bold text-primary-txt dark:text-primary-txt-dk'
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
      {
        props.images.length <= 1 && props.imageLayout !== 'row' ?
          <div
            className={tw(
              'w-full overflow-hidden aspect-square',
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
            <div className='flex justify-center w-full'>
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
      {props.nftsDescriptionsVisible != false && <div className="p-4 md:p-3 flex flex-col">
        <span className={tw(
          'text-2xl lg:text-xl md:text-lg sm:text-base font-semibold truncate',
          isNullOrEmpty(props.title) ?
            'text-secondary-txt' :
            'text-primary-txt dark:text-primary-txt-dk'
        )}>
          {isNullOrEmpty(props.title) ? 'Unknown Name' : props.title}
        </span>
        {props.subtitle && <span
          className='text-sm sm:text-xs text-secondary-txt mt-2'
        >
          {props.subtitle}
        </span>}
        {(props.traits ?? []).map((pair, index) => makeTrait(pair, index))}
 
        {!isNullOrEmpty(props.description) && (
          <div className='mt-4 text-secondary-txt text-sm sm:text-xs'>
            {props.description}
          </div>
        )}
        {(listings?.find(listing => listing.price != null) != null) && (
          <div className='mt-4 flex justify-start items-center'>
            {listings[0].price && <Link href={listings[0].url}>
              <OpenseaIcon className='h-9 w-9 relative shrink-0 hover:opacity-70' alt="Opensea logo redirect" layout="fill"/>
            </Link>}
            {listings[1].price && <Link href={listings[1].url}>
              <LooksrareIcon className='h-9 w-9 relative shrink-0 hover:opacity-70' alt="Looksrare logo redirect" layout="fill"/>
            </Link>}
            {(!listings[0].price && !listings[1].price) && <div className="h-9"></div>}
          </div>)
        }
        {
          props.cta &&
            <div
              className="mt-4 text-sm sm:text-xs cursor-pointer hover:underline"
              style={{ color: link }}
            >
              {props.cta}
            </div>
        }
      </div>}
    </div>
  );
}