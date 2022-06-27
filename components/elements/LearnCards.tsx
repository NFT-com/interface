/* eslint-disable @next/next/no-img-element */
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

import { tw } from 'utils/tw';

import { useCallback } from 'react';
// import Swiper core and required modules
import SwiperCore, {
  Pagination
} from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

// install Swiper modules
SwiperCore.use([Pagination]);

interface LearnCardsProps {
  cardTitles: string[];
}

export const LearnCards = (props: LearnCardsProps) => {
  const getCardTitle = useCallback((item: string, index: number) => {
    return (item &&
        <SwiperSlide>
          <div
            className={tw(
              'drop-shadow-md rounded-xl flex flex-col',
              'w-full h-full',
              'my-4',
              'bg-gray-opacity',
              'text-header leading-header font-header text-center',
              'py-20'
            )}>
            {props.cardTitles[index]}
          </div>
        </SwiperSlide>

    );
  }, [props.cardTitles]);
  return (
    <Swiper
      slidesPerView={1.5}
      spaceBetween={20}
      slidesPerGroup={1}
      loop={true}
      loopFillGroupWithBlank={true}
      pagination={{
        'clickable': true
      }} navigation={true}
    >
      {props.cardTitles?.map((item, index) => {
        return getCardTitle(item, index);
      })}
    </Swiper>
  );
};