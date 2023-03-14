import fallbackPlaceholder from '/public/assets/fallback-image.svg';
import cn from 'clsx';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type BlurImageProps = {
  className?: string;
  fallbackImage?: any;
} & ImageProps

export default function BlurImage(props : BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      alt={props.alt}
      // TODO: Add base64 encoded fallback image
      // placeholder="blur"
      // blurDataURL={fallbackPlaceholder}
      placeholder={fallbackPlaceholder}
      className={cn(
        props.className,
        'duration-700 ease-in-out',
        isLoading
          ? 'grayscale blur-2xl scale-110'
          : 'grayscale-0 blur-0 scale-100'
      )}
      onLoadingComplete={() => setLoading(false)}
      {...props}
    />
  );
}
