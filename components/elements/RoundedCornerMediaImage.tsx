import Image from 'next/image';

export const RoundedCornerMediaImage = (props: {
  src: any;
  priority?: boolean;
  onError: () => void;
  className: string;
}) => {
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
    />
  );
};
