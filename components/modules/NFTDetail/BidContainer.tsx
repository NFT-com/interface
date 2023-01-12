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
    <div className="font-noi-grotesk pb-4 md:pb-0 minxl:py-5 minxl:pb-0 w-full mb-5">
      <div className='flex flex-col max-w-nftcom w-full'>
        <div className={tw(
          'flex flex-col bg-white rounded-[18px] shadow-xl border border-gray-200 mb-5 w-full max-w-nftcom h-fit justify-between relative font-noi-grotesk',
        )}>
          <div className='w-full flex items-center'>
            <div className="relative h-full w-1/2 left-0">
              <div className="h-8 px-6 pb-6 pt-10 w-full flex items-center">
                <span className='text-[28px] font-semibold text-black'>
                  Current Bid
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
            </div>
            <div className="relative h-full w-1/2 right-0">
              <div className="h-8 px-6 pb-6 pt-10 w-full flex items-center">
                <span className='text-[28px] font-semibold text-black'>
                  Current Bid
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
            </div>
          </div>
          <div className='flex w-full h-full px-6 py-4 rounded-br-[18px] rounded-bl-[18px] bg-[#F2F2F2]'>
            Button
          </div>
        </div>
      </div>

      <div className='p-4'>
        <div className='w-full flex items-center justify-between py-4'>
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
      </div>
    </div>
  );
};
