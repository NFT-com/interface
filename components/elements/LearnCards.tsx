/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { tw } from 'utils/tw';

import Link from 'next/link';
import router from 'next/router';
import SwiperCore, {
  Autoplay,Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Navigation]);

interface LearnCardsProps {
  cards: any[];
  cardImages: any[];
}

export const LearnCards = (props: LearnCardsProps) => {
  return (
    <Swiper slidesPerView={1} centeredSlides={true} loop={true} autoplay={{
      'delay': 3500,
      'disableOnInteraction': false
    }} className='flex space-x-4 drop-shadow-md'>
      {props?.cards?.map((card, index) => (
        <Link href={card['linkTo']} passHref key={card['title']}>
          <SwiperSlide
            key={card['title']}
            className={tw(
              'drop-shadow-md rounded-xl flex-none',
              'w-full h-full tracking-wider text-white',
              'my-4',
              'text-header leading-header font-header text-center',
              card['title'].length > 14 ? 'lg:py-11 py-20': 'py-20' ,
              'px-4',
            )}
            onClick={() => router.push(card['linkTo'])}
            style={{
              background: `url("${props.cardImages[index].url}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              fontSize: '32px'
            }}
          >
            {card['title']}
          </SwiperSlide>
        </Link>
      ))}
    </Swiper>
  );
};