import Loader from 'components/elements/Loader';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

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
      style={{ backgroundImage: `url(${props.imageOverride ?? defaultBanner})` }}
      className={tw(
        'relative flex flex-row items-end justify-center bg-[#05080c]',
        props.isCollection ? 'bg-cover minxl:bg-contain bg-center' : 'bg-cover bg-center',
        props.isCollection ? 'h-[120px]' : 'h-60 minxl:h-72',
      )}
    >
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
