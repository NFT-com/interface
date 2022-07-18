import { ProfileQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect,useState } from 'react';

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
  }, [autoplay]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  );

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  return (
    <div className='relative overflow-hidden'>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-4 py-4">
          {props.profiles.map((profile, index) => (
            <RoundedCornerMedia
              key={profile?.profile?.id ?? index}
              src={profile?.profile?.photoURL}
              variant={RoundedCornerVariant.All}
              containerClasses={'h-full w-full drop-shadow-xl p-4'}
              onClick={() => router.push(`/${profile?.profile?.url}`)}
            />
          ))}
        </div>
        <div className="flex items-center justify-center mt-5 space-x-2">
          {scrollSnaps.map((_, idx) => (
            <div className={`w-3 h-3 bg-blog-slider-blue border rounded-full flex justify-center items-center ${
              idx === selectedIndex ? 'border-[#0077BA]' : 'none'
            }`} key={idx} >
              <button
                className={`w-2 h-2 rounded-full ${
                  idx === selectedIndex ? 'bg-[#0077BA]' : 'bg-[#B7C6CE]'
                }`}
                onClick={() => scrollTo(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};