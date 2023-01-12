import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft } from 'graphql/generated/types';

import moment from 'moment';
import Link from 'next/link';
import { PartialDeep } from 'type-fest';
import { useEffect, useState } from 'react';
import { tw } from 'utils/tw';

export type BidContainerProps = {
  data: PartialDeep<Nft>;
}

// TODO: add more bid UI for auction ends / place bid
export const BidContainer = ({ data }: BidContainerProps) => {
  const [countdownText, setCountdownText] = useState('-');
  const time = 1673553820000;
  const timeEnd = 1673553820000 + 23 * 60 * 60 * 1000; // 100 days in future
  const profileUrl = 'johndoe';

  const countdown = (timestamp) => {
    const now = Date.now();
    const distance = timestamp - now;
  
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    return `${(days > 0) ? days + 'd ' : ''}
      ${(hours > 0) ? hours + 'h ' : ''}
      ${(minutes > 0) ? minutes + 'm ' : ''}
      ${(seconds > 0) ? seconds + 's ' : ''}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdownText(countdown(timeEnd));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeEnd]);

  return (
    <div className="font-noi-grotesk overflow-x-auto pb-4 md:pb-0 minxl:py-5 minxl:pb-0 w-full mb-5">
      <div className='flex flex-col max-w-nftcom w-full'>
        <div className={tw(
          'flex flex-col bg-white rounded-[18px] shadow-xl border border-gray-200 mb-5 w-full max-w-nftcom h-fit justify-between relative font-noi-grotesk',
        )}>
          <div className="h-8 px-6 pb-6 pt-10 w-full flex items-center">
            <span className='text-[28px] font-semibold text-black'>
              Fixed Price
            </span>
          </div>
          <div className='flex font-noi-grotesk text-black leading-6 items-center my-8 md:my-6 px-6 justify-between'>
            <div className='flex md:flex-col md:items-start items-end leading-6'>
              <div className='flex items-end'>
                <div className='flex items-end'>
                  Icon
                  <span className='text-[37px] font-semibold'>Something</span>
                </div>
                <span className='mx-1.5 text-[15px] uppercase font-semibold'>WETH</span>
              </div>
              <span className="md:ml-0 md:mt-2 ml-2 text-[15px] uppercase font-medium text-[#6A6A6A]">
                $123.11
              </span>
            </div>
          </div>
          <div className='flex w-full h-full px-6 py-4 rounded-br-[18px] rounded-bl-[18px] bg-[#F2F2F2]'>
            Button
          </div>
        </div>
      </div>

      <div className='p-4'>
        <div className='w-full flex items-center justify-between py-8'>
          <div className='flex items-center'>
            <span className='text-[#6A6A6A] text-[16px]'>Auction ends in</span>
            <span className='font-medium text-[18px] ml-1.5'>{countdownText}</span>
          </div>
          <div onClick={() => {
            alert('something');
          }} className='cursor-pointer ml-3 rounded-[12px] font-medium text-center px-10 py-3 text-[17px] text-white bg-black'>
            Place Bid
          </div>
        </div>

        <div className='font-semibold text-[24px] mb-2'>
          History
        </div>
        <div className='max-h-[292px] overflow-y-scroll hideScroll'>
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
      </div>
    </div>
  );
};
