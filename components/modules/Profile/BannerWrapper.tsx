import { PropsWithChildren, useMemo } from 'react';

import BlurImage from 'components/elements/BlurImage';
import Loader from 'components/elements/Loader/Loader';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

export interface BannerWrapperProps {
  alt: string;
  imageOverride?: string;
  draft?: boolean;
  loading?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isCollection?: boolean;
}

const defaultBanner = getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)
  ? 'https://cdn.nft.com/collectionBanner_default.png'
  : 'https://cdn.nft.com/profile-banner-default-logo-key.png';

export function BannerWrapper({
  alt = 'banner image',
  children,
  draft,
  imageOverride,
  loading,
  onMouseEnter,
  onMouseLeave
}: PropsWithChildren<BannerWrapperProps>) {
  const imageUrl = useMemo(() => (imageOverride && !loading ? imageOverride : defaultBanner), [imageOverride, loading]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={tw(
        'relative flex flex-row items-end justify-center bg-[#05080c]',
        'bg-cover bg-center',
        'h-[120px] minlg:h-[320px]'
      )}
    >
      {imageUrl && (
        <BlurImage
          alt={alt}
          src={imageUrl}
          localImage={draft}
          sizes='100vw'
          className='object-cover'
          fill
          priority
          quality='100'
        />
      )}
      {loading && (
        <div
          style={{ zIndex: 102 }}
          className={tw('absolute flex bg-white/10', 'h-full w-full items-center justify-center')}
        >
          <Loader />
        </div>
      )}
      <div
        className='flex h-full items-end justify-start'
        style={{
          minWidth: '100%',
          maxWidth: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
}
