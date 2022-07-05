/* eslint-disable @next/next/no-img-element */
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import { ProfileQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { RoundedCornerMedia, RoundedCornerVariant } from './RoundedCornerMedia';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect,useState } from 'react';

interface ProfileFeedProps {
  profiles: ProfileQuery[];
}

export const ProfileFeed = (props: ProfileFeedProps) => {
  const options = { delay: 5000 };
  const autoplayRoot = (emblaRoot) => emblaRoot.parentElement;
  const autoplay = Autoplay(options, autoplayRoot);
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
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
    <div
      className={tw(
        'drop-shadow-md rounded-xl flex flex-col',
        'w-full h-full',
        'justify-between cursor-pointer',
        'm-auto',
        'my-6',
        'p-auto',
      )}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {props.profiles.map((profile) => (
            <RoundedCornerMedia
              key={profile?.profile?.id}
              src={profile?.profile.photoURL}
              variant={RoundedCornerVariant.All}
              containerClasses={'h-full'}
            />
          ))}
        </div>
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
  );
};