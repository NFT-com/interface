import { getBaseUrl, isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { RoundedCornerMediaImage as StaticRoundedCornerMediaImage } from './RoundedCornerMediaImage';

import { nftComCdnLoader } from 'lib/image/loader';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
export enum RoundedCornerVariant {
  TopOnly = 'topOnly',
  TopLeft = 'topleft',
  TopRight = 'topright',
  BottomLeft = 'bottomleft',
  BottomRight = 'bottomright',
  Left = 'left',
  Right = 'right',
  All = 'all',
  Full = 'full',
  Asset = 'asset',
  Success = 'success',
  None = 'none',
}

export enum RoundedCornerAmount {
  Medium = 'Medium',
  Default = 'Default'
}

export interface RoundedCornerMediaProps {
  src: string;
  priority?: boolean;
  fallbackImage?: string;
  variant: RoundedCornerVariant;
  amount?: RoundedCornerAmount;
  width?: number;
  height?: number;
  videoOverride?: boolean;
  extraClasses?: string;
  containerClasses?: string;
  onClick?: () => void;
  objectFit?: 'contain' | 'cover';
}

// TODO:  Add twMerge util class & prettier config to resolve duplicate tw classes
export const getRoundedClass = (variant: RoundedCornerVariant, amount: RoundedCornerAmount): string => {
  switch (variant) {
  case RoundedCornerVariant.TopOnly:
    return `${amount === RoundedCornerAmount.Medium ? 'rounded-t-md' : 'rounded-t-3xl'} object-cover`;
  case RoundedCornerVariant.TopLeft:
    return amount === RoundedCornerAmount.Medium ? 'rounded-tl-md' : 'rounded-tl-3xl';
  case RoundedCornerVariant.TopRight:
    return amount === RoundedCornerAmount.Medium ? 'rounded-tr-md' : 'rounded-tr-3xl';
  case RoundedCornerVariant.BottomLeft:
    return amount === RoundedCornerAmount.Medium ? 'rounded-bl-md' : 'rounded-bl-3xl';
  case RoundedCornerVariant.BottomRight:
    return amount === RoundedCornerAmount.Medium ? 'rounded-br-md' : 'rounded-br-3xl';
  case RoundedCornerVariant.Right:
    return amount === RoundedCornerAmount.Medium ? 'rounded-r-md' : 'rounded-r-3xl';
  case RoundedCornerVariant.Left:
    return amount === RoundedCornerAmount.Medium ? 'rounded-l-md' : 'rounded-l-3xl';
  case RoundedCornerVariant.All:
    return `${amount === RoundedCornerAmount.Medium ? 'rounded-md' : 'rounded-3xl'} object-cover`;
  case RoundedCornerVariant.Asset:
    return 'rounded-[6px]';
  case RoundedCornerVariant.Success:
    return 'rounded-[18px]';
  case RoundedCornerVariant.Full:
    return 'rounded-full object-cover';
  case RoundedCornerVariant.None:
  default:
    return '';
  }
};

const DynamicRoundedCornerMediaImage = dynamic<React.ComponentProps<typeof StaticRoundedCornerMediaImage>>(() => import('components/elements/RoundedCornerMediaImage').then(mod => mod.RoundedCornerMediaImage));

export const RoundedCornerMedia = React.memo(function RoundedCornerMedia(props: RoundedCornerMediaProps) {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = props?.src?.split('?')[0];
  const ext = url?.split('.').pop();
  useEffect(() => {
    if(props?.src?.includes('?width=600')){
      setImageSrc(props?.src);
    } else {
      if(ext === 'svg') {
        setImageSrc(url);
      } else {
        setImageSrc(props?.src);
      }
    }
  }, [props?.src, ext, url]);

  const imageUrl = imageSrc || props?.src;
  const rawImageBool = (imageUrl?.indexOf('cdn.nft.com') >= 0 && imageUrl?.indexOf('.svg') >= 0) ||
  imageUrl?.indexOf('ens.domains') >= 0 ||
  (imageUrl?.indexOf('storage.googleapis.com') >= 0 && imageUrl?.indexOf('.svg') >= 0);

  return (
    <div className={tw(
      'relative object-cover aspect-square overflow-hidden',
      getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
      props.containerClasses
    )}
    onClick={props?.onClick}
    >
      {(props.videoOverride || imageUrl?.indexOf('data:') >= 0) ?
        <div>
          {loading &&
            <div
              className={tw(
                props.objectFit === 'contain' ? 'object-cover minmd:object-contain' : 'object-cover',
                'absolute w-full h-full flex justify-center items-center',
                getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
                props.extraClasses
              )}
            >
              <div className={tw(
                'animate-pulse bg-gray-300 h-11/12 aspect-square',
                'rounded-md'
              )} />
            </div>
          }
          <video
            autoPlay
            muted={!props.videoOverride}
            loop
            key={props?.src}
            src={props?.src}
            poster={props?.src}
            onLoadedData={() => setLoading(false)}
            className={tw(
              props.objectFit === 'contain' ? 'object-cover minmd:object-contain' : 'object-cover',
              'absolute w-full h-full justify-center',
              getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
              props.extraClasses
            )}
          />
        </div>
        : rawImageBool ?
          <Image
            alt='NFT Image'
            key={props.src}
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loader={nftComCdnLoader}
            className={tw(
              props.objectFit === 'contain' ? 'object-cover minmd:object-contain' : 'object-cover',
              'absolute w-full h-full justify-center',
              getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
              props.extraClasses
            )}
          /> :
          (imageUrl != 'null?width=600') && <DynamicRoundedCornerMediaImage
            priority={props?.priority}
            src={(imageUrl?.indexOf('.svg') >= 0 && imageUrl?.indexOf('nft.com') >= 0) ? imageUrl : `${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(imageUrl)}&height=${props?.height || 300}&width=${props?.width || 300}`}
            loader={nftComCdnLoader}
            onError={() => {
              setImageSrc(!isNullOrEmpty(props?.fallbackImage) ? processIPFSURL(props?.fallbackImage) : props?.src?.includes('?width=600') ? props?.src?.split('?')[0] : props?.src);
            }}
            className={tw(
              props.objectFit === 'contain' ? 'object-cover minmd:object-contain' : 'object-cover',
              'absolute w-full h-full justify-center',
              getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
              props.extraClasses
            )}
          />
      }
    </div>
  );
});
