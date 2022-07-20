import { ProfileQuery } from 'graphql/generated/types';

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
    <div className='relative overflow-hidden w-full '>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-1 py-4 drop-shadow-xl">
          {props.profiles.map((profile, index) => (
            <RoundedCornerMedia
              key={profile?.profile?.id ?? index}
              src={profile?.profile?.photoURL}
              variant={RoundedCornerVariant.All}
              containerClasses={'h-full sm:w-full w-[25%] flex-none relative drop-shadow-xl p-4'}
              onClick={() => onSlideClick(profile?.profile?.url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};