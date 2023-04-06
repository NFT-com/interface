import Image, { ImageProps } from 'next/image';

export interface RoundedCornerMediaImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  src: any;
  priority?: boolean;
  onError: () => void;
  className: string;
}

export const RoundedCornerMediaImage = (props: RoundedCornerMediaImageProps) => {
  return (
    <Image
      alt='NFT Image'
      key={props.src}
      quality='50'
      fill
      priority={props?.priority}
      src={props.src}
      onError={props.onError}
      className={props.className}
      {...props}
    />
  );
};
