/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { ProfileCard } from 'components/modules/Profile/ProfileCard';
import { ProfileQuery } from 'graphql/generated/types';
import useWindowDimensions from 'hooks/useWindowDimensions';

import SwiperCore, { Autoplay, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Navigation]);

interface ProfileFeedProps {
  profiles: ProfileQuery[];
}

export const ProfileFeed = ({ profiles }: ProfileFeedProps) => {
  const { width: screenWidth } = useWindowDimensions();

  return (
    <Swiper
      slidesPerView={screenWidth < 600 ? 1.2 : screenWidth >= 600 && screenWidth < 900 ? 3.2 : 4.2}
      centeredSlides={false}
      loop={true}
      autoplay={{
        'delay': 3000,
        'disableOnInteraction': false
      }}
      className="flex drop-shadow-2xl"
    >
      {profiles.map((profile, index) => (
        <SwiperSlide key={profile?.profile?.id ?? index} virtualIndex={index} className='flex-none cursor-pointer ml-12'>
          <ProfileCard profile={profile?.profile} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};