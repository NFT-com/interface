import Loader from 'components/elements/Loader';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { PropsWithChildren } from 'react';
import { isMobile } from 'react-device-detect';
import Image from 'next/image';

export interface BannerWrapperProps {
  imageOverride?: string
  loading?: boolean;
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
}

const defaultBanner = getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ?
  'https://cdn.nft.com/empty_profile_banner.png'
  : 'https://cdn.nft.com/profile-banner-default-logo-key.png';

export function BannerWrapper(props: PropsWithChildren<BannerWrapperProps>) {
  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={tw(
        'relative flex flex-row items-end justify-center bg-[#05080c]',
        'xs:h-28 sm:h-32 lg:h-60 h-72',
      )}
    >
      <Image
        src={props?.imageOverride ?? defaultBanner}
        layout='fill'
        objectFit='cover'
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
          minWidth: isMobile ? '100%' : '1000px',
          maxWidth: isMobile ? '100%' : '1000px',
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
