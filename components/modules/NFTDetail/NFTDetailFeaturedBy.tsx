/* eslint-disable import/no-unresolved */
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { ProfileCard } from 'components/modules/Profile/ProfileCard';
import { useProfilesByDisplayedNft } from 'graphql/hooks/useProfilesByDisplayedNftQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { tw } from 'utils/tw';

import SwiperCore, { Autoplay, Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Navigation]);
export interface NFTDetailFeaturedByProps {
  contract: string,
  tokenId: string
}

export function NFTDetailFeaturedBy(props: NFTDetailFeaturedByProps) {
  const { width: screenWidth } = useWindowDimensions();
  const defaultChainId = useDefaultChainId();
  const { data: profiles } = useProfilesByDisplayedNft(
    props.contract,
    props.tokenId,
    defaultChainId,
    true
  );

  if (profiles == null) {
    return null;
  }

  return <div className='flex flex-col w-full px-[16px]'>
    <span className="text-2xl font-bold font-grotesk mb-2">
        Profiles that feature this NFT
    </span>
    <div className='flex py-2 h-full items-stretch'>
      <Swiper
        slidesPerView={screenWidth < 600
          ? 1
          : (screenWidth >= 600 && screenWidth < 900)
            ? (profiles?.length >= 3)
              ? 3
              : profiles?.length
            : (profiles?.length >= 4)
              ? 4
              : profiles?.length}
        centeredSlides={false}
        loop={profiles?.length > 4}
        autoplay={{
          'delay': 4500,
          'disableOnInteraction': false
        }}
        className="flex drop-shadow-2xl"
      >
        {profiles?.map((profile, index) => {
          return (
            <SwiperSlide className={tw(
              'flex flex-col w-72 shrink-0 cursor-pointer self-stretch',
            )} key={profile?.id ?? index}>
              <ProfileCard profile={profile} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  </div>;
}