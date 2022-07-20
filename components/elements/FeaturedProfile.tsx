import { Nft, ProfileQuery } from 'graphql/generated/types';
import { processIPFSURL } from 'utils/helpers';

import Loader from './Loader';
import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PartialDeep } from 'type-fest';

interface FeaturedProfileProps {
  profileOwner: ProfileQuery;
  gkId: number;
  featuredNfts: PartialDeep<Nft>[];
}

export const FeaturedProfile = (props: FeaturedProfileProps) => {
  const router = useRouter();

  return (
    <div className='w-full h-full sm:px-0 md:px-0 px-20 text-body text-[#6F6F6F] font-grotesk leading-body font-header drop-shadow-2xl md:py-4 py-12'>
      <p className='mb-2 md:mb-4'>Featured Profile</p>
      <div className='flex flex-col bg-[#B0AFAF26]/20 rounded-md backdrop-blur-xl px-4 py-6 cursor-pointer' onClick={() => router.push(`/${props.profileOwner.profile.url}`)}>
        <div className='flex flex-row items-center mb-5'>
          <div className="h-10 w-10 mr-2 mt-0.5">
            {
              props.profileOwner ?
                <Link href={props.profileOwner.profile.url}>
                  <Image
                    src={props.profileOwner?.profile?.photoURL ?? 'https://cdn.nft.com/profile-image-default.svg'}
                    alt='featured profile main image'
                    className="rounded-full"
                    width="100%"
                    height="100%"
                  />
                </Link>
                :
                <Loader />
            }
          </div>
          <p className="text-[#6F6F6F] font-grotesk text-xl">
            {props?.profileOwner?.profile?.url}
          </p>
        </div>
        <div className='grid grid-cols-1.3 grid-rows-2 gap-x-2 gap-y-2 sm:gap-4 sm:grid-flow-col sm:auto-cols-[90%] sm:overflow-x-auto sm:grid-cols-none sm:grid-rows-1 md:min-h-[250px] sm:min-h-[410px] sm:overscroll-x-contain'>
          <Link href={`/app/nft/${props.featuredNfts[0]?.contract}/${props.featuredNfts[0]?.tokenId}`} passHref>
            <a className='flex flex-col w-full row-span-2 sm:row-auto sm:aspect-square sm:h-full'>
              <RoundedCornerMedia src={processIPFSURL(props.featuredNfts[0]?.metadata?.imageURL)} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md object-cover' containerClasses='h-full' />
              <div className='bg-white rounded-b-md px-3 py-2'>
                <p className='text-xxs2 text-[#727272] '>{props.featuredNfts[0]?.metadata?.name}</p>
                <p className='text-black text-sm -mt-1'>{props.featuredNfts[0]?.metadata?.name}</p>
              </div>
            </a>
          </Link>
          <Link href={`/app/nft/${props.featuredNfts[1]?.contract}/${props.featuredNfts[1]?.tokenId}`} passHref>
            <a className='flex flex-col w-full sm:row-auto sm:aspect-square sm:h-full'>
              <RoundedCornerMedia src={processIPFSURL(props.featuredNfts[1]?.metadata?.imageURL)} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md object-cover' containerClasses='sm:h-full' />
              <div className='bg-white rounded-b-md px-3 py-1 sm:px-3 sm:py-2'>
                <p className='text-xxs4 text-[#727272] sm:text-xxs2'>{props.featuredNfts[1]?.metadata?.name}</p>
                <p className='text-black text-xs -mt-1 sm:text-sm'>{props.featuredNfts[1]?.metadata?.name}</p>
              </div>
            </a>
          </Link>
          <Link href={`/app/nft/${props.featuredNfts[2]?.contract}/${props.featuredNfts[2]?.tokenId}`} passHref>
            <a className='flex flex-col w-full sm:row-auto sm:aspect-square sm:h-full'>
              <RoundedCornerMedia src={processIPFSURL(props.featuredNfts[2]?.metadata?.imageURL)} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md object-cover' containerClasses='sm:h-full' />
              <div className='bg-white rounded-b-md px-3 py-1 sm:px-3 sm:py-2'>
                <p className='text-xxs4 text-[#727272] sm:text-xxs2'>{props.featuredNfts[2]?.metadata?.name}</p>
                <p className='text-black text-xs -mt-1 sm:text-sm'>{props.featuredNfts[2]?.metadata?.name}</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};