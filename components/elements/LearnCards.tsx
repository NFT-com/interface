import { tw } from 'utils/tw';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import router from 'next/router';
import { useCallback, useEffect, useState } from 'react';

interface LearnCardsProps {
  cards: any[];
  cardImages: any[];
}

export const LearnCards = (props: LearnCardsProps) => {
  const options = { delay: 5000 };
  const autoplayRoot = (emblaRoot) => emblaRoot.parentElement;
  const autoplay = Autoplay(options, autoplayRoot);
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    align: 'start'
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

  const onSlideClick = useCallback(
    (cardUrl) => {
      if (embla && embla.clickAllowed()) router.push(`${cardUrl}`);
    },
    [embla],
  );

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on('select', onSelect);
  }, [embla, setScrollSnaps, onSelect]);

  return (
    <div className='relative overflow-hidden'>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-4">
          {props?.cards?.map((card, index) => (
            <Link href={card['linkTo']} passHref key={card['title']}>
              <a
                key={card['title']}
                className={tw(
                  'drop-shadow-md rounded-xl flex-none',
                  'w-full h-full',
                  'my-4',
                  'text-header leading-header font-header text-center',
                  'py-20',
                  'px-4',
                )}
                onClick={() => onSlideClick(card['linkTo'])}
                style={{
                  background: `url("${props.cardImages[index].url}")`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              >
                {card['title']}
              </a>
            </Link>
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