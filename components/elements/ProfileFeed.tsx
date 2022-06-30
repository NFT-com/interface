/* eslint-disable @next/next/no-img-element */
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

// import Swiper core and required modules
import SwiperCore, {
  Pagination
} from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

// install Swiper modules
SwiperCore.use([Pagination]);

interface ProfileFeedProps {
  profiles: string[];
}

export const ProfileFeed = (props: ProfileFeedProps) => {
  return (
    <div
      className={tw(
        'drop-shadow-md rounded-xl flex flex-col',
        'w-full h-full',
        'justify-between cursor-pointer',
        'overflow-hidden',
        'my-6',
      )}>
      <Swiper slidesPerView={3} spaceBetween={30} slidesPerGroup={2} loop={true} loopFillGroupWithBlank pagination={{
        'clickable': true
      }} navigation={true}>
        <SwiperSlide
        >
          <div className='flex flex-col w-full row-auto aspect-square h-full transform hover:scale-105'>
            <RoundedCornerMedia src={props?.profiles[0]} variant={RoundedCornerVariant.All} extraClasses='relative rounded-t-md' containerClasses='h-full' />
            <div className='bg-white rounded-b-md px-3 py-2'>
              <p className='text-xxs2 text-[#727272] '>Azuki</p>
              <p className='text-black text-sm -mt-1'>Azuki #5552</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide
          style={{ width: '100%' }}
        >
          <div className='flex flex-col w-full row-auto aspect-square h-full transform hover:scale-105'>
            <RoundedCornerMedia src={props?.profiles[1]} variant={RoundedCornerVariant.All} extraClasses='relative rounded-t-md' containerClasses='h-full' />
            <div className='bg-white rounded-b-md px-3 py-2'>
              <p className='text-xxs2 text-[#727272] '>Azuki</p>
              <p className='text-black text-sm -mt-1'>Azuki #5552</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};