import { ProfileQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

interface ProfileFeedProps {
  profiles: ProfileQuery[];
}

export const ProfileFeed = (props: ProfileFeedProps) => {
  const router = useRouter();
  const options = { delay: 5000 };
  const autoplayRoot = (emblaRoot) => emblaRoot.parentElement;
  const autoplay = Autoplay(options, autoplayRoot);
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    draggable: true,
  }, [autoplay]);

  const onSlideClick = useCallback(
    (profileUrl) => {
      if (embla && embla.clickAllowed()) router.push(`/${profileUrl}`);
    },
    [embla, router],
  );

  useEffect(() => {
    if (!embla) return;
  }, [embla]);

  return (
    <div className='relative overflow-hidden w-full'>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-1 py-4 drop-shadow-lg">
          {props.profiles.map((profile, index) => (
            <a key={profile?.profile?.id ?? index} className='h-full sm:w-3/4 w-[40%] flex-none cursor-pointer px-4 drop-shadow-xl'>
              <RoundedCornerMedia
                src={profile?.profile?.photoURL}
                variant={RoundedCornerVariant.All}
                containerClasses={tw(
                  'h-full w-full flex-none cursor-pointer relative',
                )}
                onClick={() => onSlideClick(profile?.profile?.url)}
              />
              <div className='relative w-full h-full flex-none rounded-b-3xl'>
                <div className='absolute md:h-[50px] xl:h-[80px] rounded-b-3xl bottom-0 flex flex-row items-center bg-[#B0AFAF]/80 w-full backdrop-blur-3xl'>
                  <p className='text-white md:text-base lg:text-md font-grotesk pl-6'>{profile?.profile?.url}</p>
                </div>
              </div>
            </a>

          ))}
        </div>
      </div>
    </div>
  );
};