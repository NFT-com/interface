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
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={props?.priority}
      src={props.src}
      onError={props.onError}
      className={props.className}
      {...props}
    />
  );
};
