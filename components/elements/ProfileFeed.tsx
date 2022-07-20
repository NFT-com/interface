/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { ProfileQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import SwiperCore, {
  Autoplay,Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Navigation]);

interface ProfileFeedProps {
  profiles: ProfileQuery[];
}

export const ProfileFeed = ({ profiles }: ProfileFeedProps) => {
  const router = useRouter();

  return (
    <Swiper slidesPerView={isMobile ? 1 : 3.25} spaceBetween={10} centeredSlides={false} loop={true} autoplay={{
      'delay': 3000,
      'disableOnInteraction': false
    }} className="flex space-x-1 py-4">
      {profiles.map((profile, index) => (
        <SwiperSlide key={profile?.profile?.id ?? index} className='h-full w-full flex-none cursor-pointer px-2'>
          <RoundedCornerMedia
            src={profile?.profile?.photoURL}
            variant={RoundedCornerVariant.All}
            containerClasses={tw(
              'h-[390px] w-3/4 sm:w-full flex-none cursor-pointer relative',
            )}
            onClick={() => router.push(`/${profile.profile.url}`)}
          />
          <div className='relative w-3/4 sm:w-full h-full flex-none rounded-b-3xl drop-shadow-xl'>
            <div className='absolute md:h-[45px] xl:h-[50px] rounded-b-3xl bottom-0 flex flex-row items-center w-full bg-white/30 backdrop-blur-md'>
              <p className='text-white md:text-lg text-xl font-grotesk pl-6'>{profile?.profile?.url}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};