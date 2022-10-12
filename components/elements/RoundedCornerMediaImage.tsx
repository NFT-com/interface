import Image from 'next/image';

export const RoundedCornerMediaImage = (props: {
  src: any;
  onError: () => void;
  className: string;
}) => {
  return (
    <Image
      alt='NFT Image'
      key={props.src}
      quality='50'
      layout='fill'
      src={props.src}
      onError={props.onError}
      className={props.className}
    />
  );
};