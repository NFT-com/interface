import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

import { nftComCdnLoader } from 'lib/image/loader';
import { defaultBlurPlaceholderUrl, getBase64Image } from 'utils/image';
import { cl } from 'utils/tw';

type BlurImageProps = {
  className?: string;
  fallbackImage?: any;
  localImage?: boolean;
} & Omit<ImageProps, 'src'> &
  Partial<Pick<ImageProps, 'src'>>;

export default function BlurImage({
  alt,
  className,
  loader,
  width,
  height,
  fill,
  src,
  sizes,
  localImage = false,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const blurLoader = src && !localImage ? loader || nftComCdnLoader : undefined;
  const layoutProps = fill
    ? {
        fill,
        sizes: sizes ?? '100vw'
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
      placeholder='blur'
      src={src ?? defaultBlurPlaceholderUrl}
      blurDataURL={defaultBlurPlaceholderUrl}
      className={cl(
        className,
        'duration-500 ease-in-out',
        isLoading ? 'scale-110 animate-pulse blur' : 'scale-100 blur-none'
      )}
      onLoadingComplete={() => setIsLoading(false)}
      {...props}
      {...layoutProps}
    />
  );
}
