import { tw } from 'utils/tw';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import router from 'next/router';
import { useCallback, useEffect } from 'react';

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
    align: 'start',
    draggable: true
  }, [autoplay]);

  const onSlideClick = useCallback(
    (cardUrl) => {
      if (embla && embla.clickAllowed()) router.push(`${cardUrl}`);
    },
    [embla],
  );

  useEffect(() => {
    if (!embla) return;
  }, [embla]);

  return (
    <div className='relative overflow-hidden'>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-4 drop-shadow-md">
          {props?.cards?.map((card, index) => (
            <Link href={card['linkTo']} passHref key={card['title']}>
              <a
                key={card['title']}
                className={tw(
                  'drop-shadow-md rounded-xl flex-none',
                  'w-full h-full tracking-wider',
                  'my-4',
                  'text-header leading-header font-header text-center',
                  card['title'].length > 14 ? 'lg:py-11 py-20': 'py-20' ,
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
      </div>
    </div>
  );
};