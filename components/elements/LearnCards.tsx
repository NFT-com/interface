/* eslint-disable import/no-unresolved */
// Import Swiper styles
import Link from 'next/link';
import router from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/navigation';

import { getBaseUrl } from 'utils/isEnv';
import { tw } from 'utils/tw';

import 'swiper/css';

interface LearnCardsProps {
  cards: any[];
  cardImages: any[];
}

export const LearnCards = (props: LearnCardsProps) => {
  return (
    <Swiper
      navigation
      slidesPerView={1}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false
      }}
      className='flex space-x-4 drop-shadow-md'
    >
      {props?.cards?.map((card, index) => (
        <Link href={card.linkTo} passHref key={card.title} legacyBehavior>
          <SwiperSlide
            key={card.title}
            className={tw(
              'flex-none rounded-xl drop-shadow-md',
              'h-full w-full tracking-wider text-white',
              'my-4',
              'text-center text-header font-header leading-header',
              card.title.length > 14 ? 'py-11 minxl:py-20' : 'py-20',
              'px-4'
            )}
            onClick={() => router.push(card.linkTo)}
            style={{
              background: `url("${getBaseUrl('https://www.nft.com/')}api/imageFetcher?url=${encodeURIComponent(
                props.cardImages[index].url
              )}&height=${1084}&width=${1084}")`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              fontSize: '32px'
            }}
          >
            {card.title}
          </SwiperSlide>
        </Link>
      ))}
    </Swiper>
  );
};
