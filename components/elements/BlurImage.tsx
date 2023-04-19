import { defaultBlurPlaceholderUrl, getBase64Image } from 'utils/image';
import { cl } from 'utils/tw';

import { nftComCdnLoader } from 'lib/image/loader';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type BlurImageProps = {
  className?: string;
  fallbackImage?: any;
  localImage?: boolean;
} & Omit<ImageProps, 'src'> & Partial<Pick<ImageProps, 'src'>>

export default function BlurImage({
  alt,
  className,
  loader,
  width,
  height,
  fill,
  src,
  localImage = false,
  ...props
} : BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const blurLoader = src && !localImage ? (loader || nftComCdnLoader) : undefined;
  const layoutProps = fill ?
    {
      fill,
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    }
    : {
      width,
      height
    };
  // Support base64 encoded images
  if (src) {
    src = getBase64Image(src as string);
  }

  return (
    <Image
      alt={alt}
      loader={blurLoader}
      placeholder="blur"
      src={src ?? defaultBlurPlaceholderUrl}
      blurDataURL={defaultBlurPlaceholderUrl}
      className={cl(
        className,
        'duration-500 ease-in-out',
        isLoading
          ? 'blur scale-110 animate-pulse'
          : 'blur-0 scale-100'
      )}
      onLoadingComplete={() => setIsLoading(false)}
      {...props}
      {...layoutProps}
    />
  );
}
