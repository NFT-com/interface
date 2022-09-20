import Loader from 'components/elements/Loader';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { PropsWithChildren } from 'react';

export interface BannerWrapperProps {
  imageOverride?: string
  loading?: boolean;
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  isCollection?: boolean
}

const defaultBanner = getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ?
  'https://cdn.nft.com/collectionBanner_default.png'
  : 'https://cdn.nft.com/profile-banner-default-logo-key.png';

export function BannerWrapper(props: PropsWithChildren<BannerWrapperProps>) {
  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={tw(
        'relative flex flex-row items-end justify-center bg-[#05080c]',
        'bg-cover bg-center',
        props.isCollection ? 'h-[320px]' : 'h-60 minxl:h-72',
      )}
    >
      <Image
        src={props.imageOverride || defaultBanner}
        layout='fill'
        priority
        objectFit='cover'
        objectPosition='center'
        alt='banner'
      />
      {props.loading && <div
        style={{ zIndex: 102 }}
        className={tw(
          'absolute flex bg-white/10',
          'items-center justify-center w-full h-full'
        )}
      >
        <Loader/>
      </div>}
      <div
        className="flex justify-start items-end h-full"
        style={{
          minWidth: '100%',
          maxWidth: '100%'
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
