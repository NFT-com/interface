import { useNftQuery } from 'graphql/hooks/useNFTQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { ExternalProtocol } from 'types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL, sameAddress } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { filterValidListings } from 'utils/marketplaceUtils';
import { getOpenseaAssetPageUrl } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { NFTCardDescription as StaticNFTCardDescription } from './NFTCardDescription';
import { RoundedCornerAmount, RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { MouseEvent, useMemo, useState } from 'react';
import { CheckSquare, Eye, EyeOff, Square } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import useSWR from 'swr';
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
  fallbackImage?: string;
  onClick?: () => void;
  onSelectToggle?: (selected: boolean) => void;
  visible?: boolean;
  onVisibleToggle?: (visible: boolean) => void;

  // By default this component takes the full width of its container.
  // If you need this component to constrain its own width, use this prop.
  // The result of this is not guaranteed, and the recommended approach is to
  // wrap this in a container with a specified width.
  constrain?: boolean;
  customBackground?: string;
  imageLayout?: 'row' | 'grid';
  nftsDescriptionsVisible?: boolean;
  customBorder?: string;
  lightModeForced?: boolean;
  layoutType?: string;
  redirectTo?: string;
}

const DynamicNFTCardDescription = dynamic<React.ComponentProps<typeof StaticNFTCardDescription>>(() => import('components/elements/NFTCardDescription').then(mod => mod.NFTCardDescription));

export function NFTCard(props: NFTCardProps) {
  const defaultChainId = useDefaultChainId();
  const { data: nft } = useNftQuery(props.contractAddress, props.tokenId);
  const { data: collectionMetadata } = useSWR('ContractMetadata' + props.contractAddress, async () => {
    return await getContractMetadata(props.contractAddress, defaultChainId);
  });
  const collectionName = collectionMetadata?.contractMetadata?.name;
  const { tileBackground, pink, secondaryIcon } = useThemeColors();
  const { address: currentAddress } = useAccount();
  const [selected, setSelected] = useState(false);

  const processedImageURLs = sameAddress(props.contractAddress, getAddress('genesisKey', defaultChainId)) && !isNullOrEmpty(props.tokenId) ?
    [getGenesisKeyThumbnail(props.tokenId)]
    : props.images.length > 0 ? props.images?.map(processIPFSURL) : [nft?.metadata?.imageURL];

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

  const showListingIcons: boolean = useMemo(() => {
    return !isNullOrEmpty(filterValidListings(nft?.listings?.items));
  }, [nft]);

  const showOpenseaListingIcon: boolean = useMemo(() => {
    return filterValidListings(nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.Seaport) != null;
  }, [nft]);

  const showLooksrareListingIcon: boolean = useMemo(() => {
    return filterValidListings(nft?.listings?.items)?.find(activity => activity.order?.protocol === ExternalProtocol.LooksRare) != null;
  }, [nft]);

  return (
    <Link href={props.redirectTo && props.redirectTo !== '' ? props.redirectTo : '#'} passHref>
      <a
        className={tw(
          'rounded flex flex-col',
          // props.nftsDescriptionsVisible != false ? 'h-full' : 'h-max',
          props.imageLayout === 'row' ? 'p-3 rounded-xl' : 'p-2 rounded',
          props.constrain ?
          // constrain self to 2 or 4 per row
            'w-2/5 minlg:w-[23%]' :
            'w-full min-h-[inherit]',
          props.customBorder ?? '',
          'cursor-pointer transform',
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

          props.onClick && props.onClick();
        }}>
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
                props.images[0] == null ? 'aspect-square' : '',
              )}
            >
              { (props.images.length === 0 || props.images[0] == null) && processedImageURLs.length === 0 ?
                null :
                <RoundedCornerMedia
                  width={600}
                  height={600}
                  containerClasses='w-full h-full overflow-hidden'
                  variant={RoundedCornerVariant.None}
                  src={processedImageURLs[0]}
                  fallbackImage={props.fallbackImage ? props.fallbackImage : null}
                  extraClasses="hover:scale-105 transition"
                />}
            </div> :
            props.imageLayout === 'row' ?
              <div className='flex justify-center w-full min-h-XL min-h-2XL'>
                {processedImageURLs.slice(0,3).map((image: string, index: number) => {
                  return <RoundedCornerMedia
                    width={150}
                    height={150}
                    key={image + index}
                    src={image}
                    variant={variantsForRow[index]}
                    containerClasses='w-1/3 overflow-hidden'
                    extraClasses='hover:scale-105 transition'
                    amount={RoundedCornerAmount.Medium}
                  />;
                })}
              </div> :
              <div className="grid grid-cols-2">
                {processedImageURLs.slice(0, 4).map((image: string, index: number) => {
                  return <RoundedCornerMedia
                    width={300}
                    height={300}
                    key={image + index}
                    src={image}
                    variant={RoundedCornerVariant.None}
                    containerClasses="overflow-hidden"
                    extraClasses='w-full rounded-3xl overflow-hidden hover:scale-105 transition'
                  />;
                })}
              </div>
        }
        {props.nftsDescriptionsVisible != false &&
          <DynamicNFTCardDescription
            imageLayout={props.imageLayout}
            collectionName={isNullOrEmpty(props.collectionName) && isNullOrEmpty(collectionName) ? 'Unknown Name' : isNullOrEmpty(props.collectionName) ? collectionName : props.collectionName}
            title={props.title}
            traits={props.traits}
            description={props.description}
            cta={props.cta}
            showListingIcons={showListingIcons}
            nft={nft}
          />}
      </a>
    </Link>
  );
}
