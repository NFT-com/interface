import { useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { tw } from 'utils/tw';

import { HomePageV3SectionDynamicLinks } from 'types/HomePage';

export interface HomePageData {
  data?: HomePageV3SectionDynamicLinks;
  isVisible?: boolean;
}

gsap.registerPlugin(ScrollTrigger);

export default function DynamicLinks({ data, isVisible }: HomePageData) {
  useEffect(() => {
    const matchMedia = gsap.matchMedia();
    matchMedia.add('(min-width: 900px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#anim-ticker-trigger',
            start: '20% bottom',
            end: '+=30px',
            toggleActions: 'play none reverse none'
          }
        })
        .to(
          '#anim-ticker-first',
          {
            y: 0,
            duration: 0.8,
            ease: 'circ.out'
          },
          0
        );
    });
  });

  return (
    <div id='anim-ticker-trigger' className='overflow-x-hidden pb-20 pt-7 minlg:pb-[5.525rem] minlg:pt-[4.625rem]'>
      <div id='anim-ticker-first' className={tw('-ml-7 text-[1.75rem] minlg:text-8xl minxxl:text-9xl')}>
        <Marquee gradient={false} speed={60} loop={0} direction='right' play={isVisible} className='flex flex-row'>
          {data?.sectionDynamicLinks?.map((tag, index) => (
            <div
              key={tag}
              className={tw(
                'group flex items-baseline px-2 minlg:px-10 minxxl:px-14',
                index === 0 ? 'mr-2 minlg:mr-10 minxxl:mr-14' : ''
              )}
            >
              <div
                role='presentation'
                className={tw(
                  'mr-2 skew-x-[-20deg] minxxl:mr-3',
                  'from-[#FECB02] to-[#FF9E39] group-hover:bg-gradient-to-b',
                  'h-[.6em] w-[.25rem] basis-[.25rem] minlg:h-[.55em] minlg:w-[.3125rem] minlg:basis-[.3125rem]',
                  'minxl:h-[.556em] minxl:w-[.0833em] minxl:basis-[.0833em]',
                  'rounded-[3px] bg-[#B2B2B2]'
                )}
              ></div>

              <i
                className={tw(
                  'animate-text-gadient bg-[length:200%_200%]',
                  'bg-gradient-to-r from-[#FF9E39] to-[#FECB02] bg-clip-text pb-4 pr-1 text-[#B2B2B2]',
                  'transition-colors group-hover:text-transparent'
                )}
              >
                {tag}
              </i>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
