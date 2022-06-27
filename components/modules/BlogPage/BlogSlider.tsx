import BlogSliderCard from './BlogSliderCard';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback,useEffect, useState } from 'react';
import { PostData } from 'types/blogs';

type BlogSliderProps = {
  posts: PostData[];
};

export default function BlogSlider({ posts }:BlogSliderProps) {
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
    <div className="mx-auto px-2.5 bg-blog-slider-blue dark:bg-dark-overlay p-3 rounded-2xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {posts?.map((post) => (
            <BlogSliderCard key={post?.sys.id} post={post} />
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
}