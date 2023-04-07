import BlurImage from './BlurImage';

import { ImageProps } from 'next/image';
export interface RoundedCornerMediaImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  src: any;
  priority?: boolean;
  onError: () => void;
  className: string;
}

export const RoundedCornerMediaImage = (props: RoundedCornerMediaImageProps) => {
  return (
    <BlurImage
      alt='NFT Image'
      key={props.src}
      quality='50'
      fill
      {...props}
    />
  );
};
