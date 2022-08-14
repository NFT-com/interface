import { CollectionItem } from 'components/modules/Search/CollectionItem';
import useWindowDimensions from 'hooks/useWindowDimensions';

import useEmblaCarousel from 'embla-carousel-react';
import React, { useCallback,useEffect, useState } from 'react';

export interface slidesProps {
  slides: string[];
  full?: boolean;
}

export interface collectionProps {
  contractAddr: string;
}

export interface buttonProps {
  enabled?: boolean;
  onClick: () => void;
  selected?: boolean
}

export const DotButton = ({ selected, onClick }: buttonProps) => (
  <button
    className={`embla__dot ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

export const PrevButton = ({ enabled, onClick }: buttonProps ) => (
  <button
    className="embla__button embla__button--prev"
    onClick={onClick}
    disabled={!enabled}
  >
    <svg className="embla__button__svg" viewBox="137.718 -1.001 366.563 644">
      <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" />
    </svg>
  </button>
);

export const NextButton = ({ enabled, onClick }: buttonProps) => (
  <button
    className="embla__button embla__button--next"
    onClick={onClick}
    disabled={!enabled}
  >
    <svg className="embla__button__svg" viewBox="0 0 238.003 238.003">
      <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" />
    </svg>
  </button>
);

const EmblaCarousel = (props: slidesProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [viewportRef, embla] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
    skipSnaps: false,
    slidesToScroll : props.full && screenWidth > 599 ? 2 : 1,
  });
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
    embla
  ]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
  }, [embla, onSelect]);

  return (
    !props.full && props.slides.length < 5 ?
      <div className="grid grid-cols-4 gap-8" >
        {props.slides.map((item: any, index) => (
          <CollectionItem key={index} contractAddr={item.document?.contractAddr}/>
        ))}
      </div>
      :
      <>
        <div className={`embla${props.full ? 'full' : ''}`}>
          <div className="embla__viewport" ref={viewportRef}>
            <div className="embla__container">
              {props.slides.map((item: any, index) => (
                <div className={`embla__slide${props.full ? 'full' : ''}`} key={index}>
                  <div className={`embla__slide__inner${props.full ? 'full' : ''}`}>
                    <div className={`${props.full ? 'embla__slide__item' : ''}`}>
                      <CollectionItem contractAddr={item.document?.contractAddr}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
        {!props.full && <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>}
      </>
  );
};

export default EmblaCarousel;