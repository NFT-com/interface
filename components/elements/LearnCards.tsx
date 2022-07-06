import { tw } from 'utils/tw';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

interface LearnCardsProps {
  cardTitles: string[];
}

export const LearnCards = (props: LearnCardsProps) => {
  const options = { delay: 5000 };
  const autoplayRoot = (emblaRoot) => emblaRoot.parentElement;
  const autoplay = Autoplay(options, autoplayRoot);
  const [emblaRef, embla] = useEmblaCarousel({
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
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {props.cardTitles.map((cardTitle) => (
          <div
            key={cardTitle}
            className={tw(
              'drop-shadow-md rounded-xl flex flex-col',
              'w-full h-full',
              'my-4',
              'bg-gray-opacity',
              'text-header leading-header font-header text-center',
              'py-20'
            )}>
            {cardTitle}
          </div>
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
  );
};