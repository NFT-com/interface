import { RoundedCornerMedia, RoundedCornerVariant } from 'components/elements/RoundedCornerMedia';
import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import OpenseaIcon from 'public/opensea-icon.svg';
import ShopIcon from 'public/shop-icon.svg';
import { useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

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
          <div className='w-full flex items-start'>
            <div className="relative h-full md:w-full w-1/2 my-6 left-0 border-r border-[#ECECEC]">
              <div className="h-8 px-6 w-full flex items-center">
                <span className='md:text-[20px] text-[28px] font-semibold text-black'>
                  Current Bid
                </span>
              </div>
              <div className='flex font-noi-grotesk text-black leading-6 items-center md:mt-5 my-5 px-6 justify-between'>
                <div className='flex md:flex-col md:items-start items-end leading-6 md:w-full'>
                  <div className='md:flex md:items-center md:justify-between md:w-full'>
                    <div className='flex items-end'>
                      <div className='flex items-end'>
                        Icon
                        <span className='text-[37px] font-semibold'>1.5</span>
                      </div>
                      <span className='mx-1.5 text-[15px] uppercase font-semibold'>WETH</span>
                    </div>
                    <div className='hidden md:flex items-center'>
                      <span className='mr-1.5'>by</span>
                      <RoundedCornerMedia
                        variant={RoundedCornerVariant.None}
                        containerClasses='w-[36px] h-[36px]'
                        src={'https://cdn2.nft.com/AaUUFf8lHoAVhmM5kTU7wt18ohoBNIZoMxKoKJdufPg/rs:fit:1000:1000:0/g:no/aHR0cHM6Ly9jZG4uZ2VuLmFydC8xMDAwMTAwODE1XzE2MzM4MzgxOTQucG5nP3dpZHRoPTYwMA.webp'}
                        extraClasses='aspect-square rounded-full'
                      />
                      <div className="hover:font-bold ml-1.5 w-full items-center text-[16px] font-medium cursor-pointer font-noi-grotesk my-4">
                        <span className='font-dm-mono text-primary-yellow'>/</span>
                        <span className='ml-1 whitespace-nowrap text-black text-ellipsis overflow-hidden'>{profileUrl}</span>
                      </div>
                    </div>
                  </div>
                  <span className="md:ml-0 md:mt-2 ml-2 text-[15px] uppercase font-medium text-[#6A6A6A]">
                    $123.11 USD
                  </span>
                </div>
              </div>
              <div className='md:hidden px-6 flex items-center font-normal font-noi-grotesk text-[14px] text-[#6A6A6A]'>
                <span>Current price on</span>
                <div className='flex items-center'>
                  <OpenseaIcon className='mx-1.5 h-6 w-6 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>
                  <span className='text-black'>Opensea</span>
                </div>
              </div>
            </div>
            <div className="md:hidden relative h-full w-1/2 my-6 right-0">
              <div className="h-8 px-6 w-full flex items-center">
                <span className='text-[28px] font-semibold text-black'>
                  Highest Bid
                </span>
              </div>
              <div className='flex font-noi-grotesk text-black leading-6 items-center my-5 px-6 justify-between'>
                <div className='flex md:flex-col md:items-start items-end leading-6'>
                  <div className='flex items-end'>
                    <div className='flex items-end'>
                      Icon
                      <span className='text-[37px] font-semibold'>1.5</span>
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
          <div className='flex w-full font-medium h-full px-6 py-4 rounded-br-[18px] rounded-bl-[18px] bg-[#F2F2F2]'>
            <button onClick={() => alert('ok')} className="md:hidden bg-[#F9D963] hover:bg-[#fcd034] text-base text-black py-3 px-4 rounded-[12px] focus:outline-none focus:shadow-outline w-full" type="button">
              Buy Now
            </button>
            <button onClick={() => alert('ok')} className="md:hidden flex bg-[#FFFFFF] whitespace-nowrap items-center ml-4 justify-center text-base border border-[#B2B2B2] text-black py-3 px-8 rounded-[12px] focus:outline-none focus:shadow-outline w-fit" type="button">
              <ShopIcon />&nbsp;Add to Cart
            </button>
            <div className='hidden w-full md:flex flex-col'>
              <div className='flex items-center'>
                <span className='text-[#6A6A6A] text-[16px]'>Auction ends in</span>
                <span className='font-medium text-[18px] ml-1.5'>{countdownText}</span>
              </div>
              <div onClick={() => {
                alert('something');
              }} className='cursor-pointer mt-3 rounded-[12px] font-medium text-center w-full px-10 py-3 text-[17px] text-black bg-[#F9D54C]'>
                Place Bid
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='md:hidden flex p-4'>
        <div className='w-full flex items-center justify-between'>
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
