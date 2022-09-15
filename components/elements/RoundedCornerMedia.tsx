/* eslint-disable @next/next/no-img-element */
import { tw } from 'utils/tw';

import React, { useCallback } from 'react';
import useSWR from 'swr';

export enum RoundedCornerVariant {
  TopOnly = 'topOnly',
  TopLeft = 'topleft',
  TopRight = 'topright',
  BottomLeft = 'bottomleft',
  BottomRight = 'bottomright',
  Left = 'left',
  Right = 'right',
  All = 'all',
  None = 'none',
}

export enum RoundedCornerAmount {
  Medium = 'Medium',
  Default = 'Default'
}

export interface RoundedCornerMediaProps {
  src: string;
  variant: RoundedCornerVariant;
  amount?: RoundedCornerAmount;
  extraClasses?: string;
  containerClasses?: string;
  onClick?: () => void;
}

const getRoundedClass = (variant: RoundedCornerVariant, amount: RoundedCornerAmount): string => {
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
  case RoundedCornerVariant.None:
  default:
    return '';
  }
};

export const RoundedCornerMedia = React.memo(function RoundedCornerMedia(props: RoundedCornerMediaProps) {
  const fetchImageUrl = useCallback(async () => {
    const badFileTypes = ['webp', 'svg', 'gif', 'mp4'];
    if(props.src?.includes('base64')){
      return props?.src;
    }
    if(props?.src?.includes('?width=600')){
      const url = props?.src.split('?')[0];
      const ext = url?.split('.').pop();
      
      if(badFileTypes.indexOf(ext) >= 0){
        return url;
      } else {
        const response = await fetch(props.src).catch(() => null);
        if(response.status === 200){
          return props.src;
        } else {
          return props.src.split('?')[0];
        }
      }
    } else {
      const ext = props?.src?.split('.').pop();
      if(badFileTypes.indexOf(ext) >= 0){
        return props?.src;
      } else {
        const response = await fetch(props?.src + '?width=600').catch(() => null);
        if(response.status === 200){
          return props?.src + '?width=600';
        } else {
          return props.src;
        }
      }
    }
  }, [props.src]);

  const { data: imgUrl } = useSWR(
    'imageUrl' + props.src,
    fetchImageUrl
  );

  return (
    <div className={tw(
      'relative object-cover aspect-square',
      getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
      props.containerClasses
    )}
    onClick={props?.onClick}
    >
      <video
        autoPlay
        muted
        loop
        key={props.src}
        src={imgUrl || props?.src}
        poster={imgUrl || props?.src}
        className={tw(
          'object-cover absolute w-full h-full justify-center',
          getRoundedClass(props.variant, props.amount ?? RoundedCornerAmount.Default),
          props.extraClasses
        )}
      />
    </div>
  );
});
