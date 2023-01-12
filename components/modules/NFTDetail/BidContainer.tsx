import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft } from 'graphql/generated/types';

import moment from 'moment';
import Link from 'next/link';
import { PartialDeep } from 'type-fest';

export type BidContainerProps = {
  data: PartialDeep<Nft>;
}

// TODO: add more bid UI for auction ends / place bid
export const BidContainer = ({ data }: BidContainerProps) => {
  const time = 1673553820000;
  const profileUrl = 'johndoe';
  return (
    <div className="font-noi-grotesk overflow-x-auto pb-4 md:pb-0 minxl:py-5 minxl:pb-0 w-full p-4 mb-3">
      <div className='font-semibold text-[24px] mb-2'>
        History
      </div>
      {[1,2,3,4].map((item, i) => <div key={i} className='flex items-center justify-between py-3 border-b border-[#ECECEC]'>
        <div className='text-[16px]'>
          <div className='font-medium'>Bid placed by</div>
          <div className='text-[#6A6A6A]'>{moment(time).format('MMM Do, YYYY')} at {moment(time).format('ha')}</div>
        </div>
        <div className='flex items-center'>
          <div className='flex items-center'>
            <RoundedCornerMedia
              variant={RoundedCornerVariant.None}
              containerClasses='w-[36px] h-[36px] overflow-hidden'
              src={'https://cdn2.nft.com/AaUUFf8lHoAVhmM5kTU7wt18ohoBNIZoMxKoKJdufPg/rs:fit:1000:1000:0/g:no/aHR0cHM6Ly9jZG4uZ2VuLmFydC8xMDAwMTAwODE1XzE2MzM4MzgxOTQucG5nP3dpZHRoPTYwMA.webp'}
              extraClasses='aspect-square rounded-full'
            />
            <Link href={`/${profileUrl}`}>
              <p className='font-medium text-[16px] ml-2 hover:cursor-pointer'>
                <span className='font-dm-mono text-primary-yellow mr-1'>/</span>
                {profileUrl}
              </p>
            </Link>
          </div>
          <div className='font-medium text-[22px] ml-10'>
            1.2 ETH
          </div>
        </div>
      </div>)}
    </div>
  );
};
