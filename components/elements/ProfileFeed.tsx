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
        'm-auto',
        'my-6',
        'p-auto',
      )}>
      <Swiper slidesPerView={3} spaceBetween={30} slidesPerGroup={2} loop={true} loopFillGroupWithBlank pagination={{
        'clickable': true
      }} navigation={true}>
        <SwiperSlide
        >
          <RoundedCornerMedia src={props?.profiles[0]} variant={RoundedCornerVariant.All} containerClasses='h-full' />
        </SwiperSlide>
        <SwiperSlide
          style={{ width: '100%' }}
        >
          <RoundedCornerMedia src={props?.profiles[1]} variant={RoundedCornerVariant.All} containerClasses='h-full' />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};