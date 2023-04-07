import { defaultBlurPlaceholderUrl } from 'utils/image';
import { cl } from 'utils/tw';

import fallbackPlaceholder from '/public/assets/fallback-image.svg';
import { nftComCdnLoader } from 'lib/image/loader';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type BlurImageProps = {
  className?: string;
  fallbackImage?: any;
} & Omit<ImageProps, 'src'> & Partial<Pick<ImageProps, 'src'>>

export default function BlurImage({ alt, className, loader, width, height, fill, src, ...props } : BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const blurLoader = src ? (loader || nftComCdnLoader) : undefined;

  const layoutProps = fill ? { fill } : { width, height };
  return (
    <Image
      alt={alt}
      loader={blurLoader}
      placeholder="blur"
      src={src ?? fallbackPlaceholder}
      blurDataURL={defaultBlurPlaceholderUrl}
      className={cl(
        className,
        'duration-500 ease-in-out',
        isLoading
          ? 'scale-110'
          : 'scale-100'
      )}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onLoadingComplete={() => setIsLoading(false)}
      {...props}
      {...layoutProps}
    />
  );
}
