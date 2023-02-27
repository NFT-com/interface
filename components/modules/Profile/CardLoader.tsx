import { tw } from 'utils/tw';

import SkeletonLoader from './SkeletonLoader';

import nftPlaceholder from '/public/nft-placeholder.svg';
import Image, { ImageProps } from 'next/image';

// interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
type CardProps = React.HTMLAttributes<HTMLDivElement>

function Card({ children, className, ...props }: CardProps) {
  return (
    <article
      className={tw(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-800/50 bg-black shadow-lg shadow-gray-700/25  transition hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </article>
  );
}

interface CardMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
  Partial<Pick<ImageProps, 'alt' | 'src'>> {}

Card.Media = function CardMedia({
  className,
  alt,
  src,
  ...props
}: CardMediaProps) {
  return (
    <div className={tw('relative grow overflow-hidden', className)} {...props}>
      <Image
        alt={alt ?? ''}
        className='overflow-hidden rounded-t-[10px] object-cover transition duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-75'
        placeholder='blur'
        // fill
        blurDataURL={nftPlaceholder}
        src={src ?? nftPlaceholder}
      />
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tokenId: string;
  collectionName?: string;
  contractAddress: string;
}

Card.Footer = function CardFooter({
  collectionName,
  contractAddress,
  title,
  tokenId,
  ...props
}: CardFooterProps) {
  return (
    <div
      className='flex h-1/4 flex-col justify-center bg-white p-4 text-black'
      {...props}
    >
      <section className='flex justify-between gap-2'>
        <h3 className='text-2xl font-bold'>{title}</h3>
        <h3 className='text-2xl font-bold'># {tokenId}</h3>
      </section>
      <section className='flex justify-between gap-2'>
        <p className='w-1/2 truncate text-sm'>{collectionName}</p>
        <p className='w-1/2 truncate text-gray-600'>{contractAddress}</p>
      </section>
    </div>
  );
};

Card.Loader = function CardLoader() {
  return (
    <Card>
      <section className='h-[300px] w-[360px]'>
        <SkeletonLoader className='h-full w-full' />
      </section>
      <div className='flex h-1/4'>
        <SkeletonLoader className='h-full w-[120px] bg-slate-200' />
      </div>
    </Card>
  );
};

export default Card;
