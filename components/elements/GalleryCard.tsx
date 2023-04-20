/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { useCheckFileType } from 'hooks/useCheckFileType';
import { tw } from 'utils/tw';

import BlurImage from './BlurImage';

export interface GalleryCardProps {
  label: string;
  imageURL: string;
  size?: 'small' | 'default';
  onClick: () => void;
  animate?: boolean;
}

function GalleryCard(props: GalleryCardProps) {
  const imageSrc = useCheckFileType(props?.imageURL);
  return (
    <div
      className={tw(
        'relative',
        'py-4',
        'flex flex-col rounded-xl drop-shadow-md',
        'aspect-square w-full',
        'transform cursor-pointer justify-between hover:scale-105',
        'overflow-hidden'
      )}
      onClick={props.onClick}
    >
      {props.animate !== false && (
        <div
          className={tw(
            'absolute z-10 animate-pulse',
            'h-full w-full rounded-xl bg-gradient-to-tr from-primary-yellow to-[#FF9D39]'
          )}
        />
      )}
      <BlurImage
        alt={props.label}
        src={imageSrc}
        fill
        className={tw('absolute z-20 aspect-square h-full w-full rounded-xl object-contain')}
      />
      <div
        className={tw(
          'absolute bottom-0 z-30 mb-4 w-full text-center font-black',
          props.size === 'small' ? 'text-base' : 'text-2xl'
        )}
        style={{
          textShadow: '0px 2px 2px rgba(0,0,0,0.5)'
        }}
      >
        {props.label}
      </div>
    </div>
  );
}
export default React.memo(GalleryCard);
