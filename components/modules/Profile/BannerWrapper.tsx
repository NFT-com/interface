import Loader from 'components/elements/Loader';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { PropsWithChildren } from 'react';

export interface BannerWrapperProps {
  imageOverride?: string;
  draft?: boolean;
  loading?: boolean;
  onMouseEnter?: () => void,
  onMouseLeave?: () => void,
  isCollection?: boolean
}

const defaultBanner = getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ?
  'https://cdn.nft.com/collectionBanner_default.png'
  : 'https://cdn.nft.com/profile-banner-default-logo-key.png';

export function BannerWrapper(props: PropsWithChildren<BannerWrapperProps>) {
  const imageUrl = props.imageOverride || defaultBanner;

  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={tw(
        'relative flex flex-row items-end justify-center bg-[#05080c]',
        'bg-cover bg-center',
        getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_V2_ENABLED) ? 'h-[120px] minlg:h-[320px]' : props.isCollection ? 'h-[320px]' : 'h-60 minxl:h-72',
      )}
    >
      {imageUrl && <Image
        src={props?.draft ? imageUrl : imageUrl.indexOf('.svg') >= 0 ? imageUrl : `${getBaseUrl(getEnv(Doppler.NEXT_PUBLIC_BASE_URL))}api/imageFetcher?gcp=${getEnvBool(Doppler.NEXT_PUBLIC_GCP_IMG_PROXY_ENABLED)}&url=${encodeURIComponent(imageUrl)}&width=3000`}
        layout='fill'
        priority
        quality='100'
        objectFit='cover'
        objectPosition='center'
        alt='banner'
      />}
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
