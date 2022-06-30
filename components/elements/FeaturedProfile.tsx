import { ProfileQuery } from 'graphql/generated/types';
import { useGenesisKeyMetadata } from 'hooks/useGenesisKeyMetadata';
import { getGenesisKeyThumbnail, isNullOrEmpty, processIPFSURL } from 'utils/helpers';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Image from 'next/image';

interface FeaturedProfileProps {
  profileOwner: ProfileQuery;
  gkId: number;
  pfpUrl: string;
}

export const FeaturedProfile = (props: FeaturedProfileProps) => {
  const genesisKeyMetadata = useGenesisKeyMetadata(props.gkId);

  const gkThumbnail = getGenesisKeyThumbnail(props.gkId);

  const gkImage = isNullOrEmpty(gkThumbnail) ?
    processIPFSURL(genesisKeyMetadata?.metadata?.image) :
    gkThumbnail;

  const image = processIPFSURL(props.profileOwner?.profile?.photoURL);

  return (
    <div className='pt-6 text-body text-secondary-txt-light leading-body font-header justify-center ... w-[430px] md:w-full'>
      <p className='mb-2 md:mb-4'>Featured Profile</p>
      <div className='flex flex-col bg-[#B0AFAF26] px-4 py-6 rounded-md'>
        <div className='flex flex-row items-center mb-5'>
          <div className="h-10 w-10 mr-2 mt-0.5">
            <Image
              src={gkImage}
              alt='featured profile main image'
              className="rounded-full"
              width="100%"
              height="100%"
            />
          </div>
          <p className="dark:text-white text-xl leading-7">
            KentMakishima
          </p>
        </div>

        <div className='grid grid-cols-1.3 grid-rows-2 gap-x-2 gap-y-2 sm:gap-4 sm:grid-flow-col sm:auto-cols-[90%] sm:overflow-x-auto sm:overscroll-contain sm:grid-cols-none sm:grid-rows-1 sm:min-h-[410px]'>
          <div className='flex flex-col w-full row-span-2 sm:row-auto sm:aspect-square sm:h-full'>
            <RoundedCornerMedia src={gkImage} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md' containerClasses='h-full' />
            <div className='bg-white rounded-b-md px-3 py-2'>
              <p className='text-xxs2 text-[#727272] '>Azuki</p>
              <p className='text-black text-sm -mt-1'>Azuki #5552</p>
            </div>
          </div>

          <div className='flex flex-col w-full sm:row-auto sm:aspect-square sm:h-full'>
            <RoundedCornerMedia src={gkImage} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md' containerClasses='sm:h-full' />
            <div className='bg-white rounded-b-md px-3 py-1 sm:px-3 sm:py-2'>
              <p className='text-xxs4 text-[#727272] sm:text-xxs2'>World of Women</p>
              <p className='text-black text-xs -mt-1 sm:text-sm'>Women #6428</p>
            </div>
          </div>

          <div className='flex flex-col w-full sm:row-auto sm:aspect-square sm:h-full'>
            <RoundedCornerMedia src={gkImage} variant={RoundedCornerVariant.None} extraClasses='relative rounded-t-md' containerClasses='sm:h-full' />
            <div className='bg-white rounded-b-md px-3 py-1 sm:px-3 sm:py-2'>
              <p className='text-xxs4 text-[#727272] sm:text-xxs2'>Marakami.Flower</p>
              <p className='text-black text-xs -mt-1 sm:text-sm'>Murakami.Flower...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};