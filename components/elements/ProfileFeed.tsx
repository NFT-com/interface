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
    <div className='relative overflow-hidden w-full drop-shadow-2xl'>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-1 py-4">
          {props.profiles.map((profile, index) => (
            <a key={profile?.profile?.id ?? index} className='h-full sm:w-3/4 w-[22%] flex-none cursor-pointer pr-4'>
              <RoundedCornerMedia
                src={profile?.profile?.photoURL}
                variant={RoundedCornerVariant.All}
                containerClasses={tw(
                  'cursor-pointer w-full',
                )}
                onClick={() => onSlideClick(profile?.profile?.url)}
              />
              <div className='relative w-full h-full flex-none rounded-b-3xl'>
                <div className='absolute md:h-[45px] xl:h-[50px] rounded-b-3xl bottom-0 flex flex-row items-center w-full bg-white/30 backdrop-blur-md'>
                  <p className='text-white md:text-lg text-xl font-grotesk pl-6'>{profile?.profile?.url}</p>
                </div>
              </div>
            </a>

          ))}
        </div>
      </div>
    </div>
  );
};