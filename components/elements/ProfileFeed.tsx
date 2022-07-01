/* eslint-disable @next/next/no-img-element */
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import { isMobile } from 'react-device-detect';
// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loader from './Loader';
import { ProfileQuery } from 'graphql/generated/types';

SwiperCore.use([Autoplay,Pagination,Navigation]);

interface ProfileFeedProps {
  profiles: ProfileQuery[];
}

export const ProfileFeed = (props: ProfileFeedProps) => {
  return (
    <Swiper
      spaceBetween={30}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      slidesPerView={isMobile ? 1 : 4}
      autoplay={{
        'delay': 2500,
        'disableOnInteraction': false
      }}
    >
      <div
        className={tw(
          'drop-shadow-md rounded-xl flex flex-col',
          'w-full h-full',
          'justify-between cursor-pointer',
          'm-auto',
          'my-6',
          'p-auto',
        )}>
        <SwiperSlide
          key={1}
          style={{ width: '100%', height: '' }}
        >
          {
            props.profiles ?
              <RoundedCornerMedia src={props?.profiles[0]?.profile?.photoURL} variant={RoundedCornerVariant.All} containerClasses='h-full' />
              :
              <Loader />
          }
        </SwiperSlide>
      </div>
      <div
        className={tw(
          'drop-shadow-md rounded-xl flex flex-col',
          'w-full h-full',
          'justify-between cursor-pointer',
          'm-auto',
          'my-6',
          'p-auto',
        )}>
        <SwiperSlide
          key={2}
          style={{ width: '100%', height: 'auto' }}
        >
          {
            props.profiles ?
            <RoundedCornerMedia src={props?.profiles[1]?.profile?.photoURL} variant={RoundedCornerVariant.All} containerClasses='h-full' />              :
              <Loader />
          }
        </SwiperSlide>
        </div>
        <div
        className={tw(
          'drop-shadow-md rounded-xl flex flex-col',
          'w-full h-full',
          'justify-between cursor-pointer',
          'm-auto',
          'my-6',
          'p-auto',
        )}>
        <SwiperSlide
          key={3}
          style={{ width: '100%', height: 'auto' }}
        >
          {
            props.profiles ?
            <RoundedCornerMedia src={props?.profiles[2]?.profile?.photoURL} variant={RoundedCornerVariant.All} containerClasses='h-full' />              :
              <Loader />
          }
        </SwiperSlide>
        </div>
        <div
        className={tw(
          'drop-shadow-md rounded-xl flex flex-col',
          'w-full h-full',
          'justify-between cursor-pointer',
          'm-auto',
          'my-6',
          'p-auto',
        )}>
        <SwiperSlide
          key={4}
          style={{ width: '100%', height: 'auto' }}
        >
          {
            props.profiles ?
            <RoundedCornerMedia src={props?.profiles[3]?.profile?.photoURL} variant={RoundedCornerVariant.All} containerClasses='h-full' />              :
              <Loader />
          }
        </SwiperSlide>
      </div>
    </Swiper>
  );
};