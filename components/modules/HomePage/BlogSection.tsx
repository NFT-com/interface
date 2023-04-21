import React, { useEffect } from 'react';
import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import BlurImage from 'components/elements/BlurImage';
import { Button, ButtonType } from 'components/elements/Button';
import { contentfulLoader } from 'lib/image/loader';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import { HomePageV3BlogSection } from 'types/HomePage';

import ArrowNav from 'public/icons/arrow-nav.svg?svgr';

export interface HomePageData {
  data?: HomePageV3BlogSection;
  blogSectionTitle: {
    title: string;
    subTitle: string;
  };
  goToBlogButton: {
    title: string;
    link: string;
  };
}

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection({ data, goToBlogButton, blogSectionTitle }: HomePageData) {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      disable() {
        const maxWidth = 900;
        return window.innerWidth >= maxWidth;
      },
      duration: 700
    });

    const matchMedia = gsap.matchMedia();
    matchMedia.add('(min-width: 900px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#anim-blog-trigger',
            start: 'top 40%',
            end: '+=30px',
            toggleActions: 'play none reverse none'
          }
        })
        .to(
          '#anim-blog-content',
          {
            x: 0,
            duration: 2,
            ease: 'power2.out'
          },
          0
        );
    });
  });

  return (
    <div id='anim-blog-trigger' className='bg-[#282828]'>
      <div className={tw('relative z-0 py-16 minlg:pb-[7.625rem] minlg:pt-[6.25rem]')}>
        <div className='relative px-7 pt-4 text-center text-white minlg:pt-0'>
          <h2
            data-aos='fade-up'
            className={tw(
              'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem]',
              'mb-8 font-normal leading-[1.0854] minlg:mb-[.625rem]'
            )}
          >
            {blogSectionTitle?.title}
          </h2>
          <p data-aos='fade-up' data-aos-delay='100' className='mb-8 text-lg minxl:mb-[3.8125rem]'>
            {blogSectionTitle?.subTitle}
          </p>
        </div>

        <div id='anim-blog-content' data-aos='fade-left' className='mb-12 minlg:translate-x-full minlg:transform-gpu'>
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={14}
            breakpoints={{
              0: {
                slidesPerView: 1.2
              },
              600: {
                slidesPerView: 2
              },
              1200: {
                slidesPerView: 3.3
              },
              1921: {
                slidesPerView: 4.3
              }
            }}
            navigation={{
              nextEl: '.js-insights-swiper__btn-next',
              prevEl: '.js-insights-swiper__btn-prev',
              disabledClass: 'swiper-button-disabled'
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false
            }}
            scrollbar={{ draggable: true }}
            className='insights-swiper flex !pb-12 !pl-[4vw] minlg:!pb-0'
          >
            {data?.items.map(preview => (
              <SwiperSlide key={preview.slug} className='!h-auto'>
                <Link
                  key={preview.slug}
                  href={`articles/${preview.slug}`}
                  className={tw(
                    'flex h-full flex-shrink-0 flex-col rounded-lg bg-white text-black md:mb-5',
                    'cursor-pointer'
                  )}
                >
                  <div className='relative overflow-hidden before:block before:pb-[66.5%]'>
                    <BlurImage
                      fill
                      className='rounded-t-lg object-cover'
                      src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(
                        preview?.heroImage?.url
                      )}`}
                      alt={preview.title}
                      loader={contentfulLoader}
                    />
                  </div>

                  <div className='flex grow flex-col items-start px-4 py-5 minxxl:px-7 minxxl:py-8'>
                    <h3
                      className={tw(
                        'text-[1.125rem] leading-[1.09375] minlg:text-[2rem] minxxl:text-[2.75rem] ',
                        'mb-11 minxxl:mb-16'
                      )}
                    >
                      {preview.title}
                    </h3>
                    <div className='mt-auto flex items-center text-xs font-medium text-[#605A45]/60 minlg:text-xl minxxl:text-3xl'>
                      <div
                        className={tw(
                          'relative mr-[6px] block rounded-full object-cover minlg:mr-3',
                          'h-5 w-5 minlg:h-9 minlg:w-9 minxxl:h-12 minxxl:w-12'
                        )}
                      >
                        <BlurImage
                          fill
                          className='rounded-full object-cover'
                          src={`${getBaseUrl(
                            'https://www.nft.com/'
                          )}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview.author?.image?.url)}`}
                          alt={`Image for author, ${preview.author?.name}`}
                          loader={contentfulLoader}
                        />
                      </div>
                      {preview.author?.name}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          data-aos='zoom-in'
          data-aos-delay='100'
          className='relative flex flex-col items-center justify-center px-[4%] text-center minmd:px-0'
        >
          <Button
            data-aos='zoom-out'
            data-aos-delay='300'
            type={ButtonType.WEB_PRIMARY}
            label={goToBlogButton?.title}
            stretch
            onClick={() => router.push(`/${goToBlogButton?.link}`)}
          />
          <div className='swiper__nav-buttons -order-1 pb-5 minmd:pb-0'>
            <button type='button' className='js-insights-swiper__btn-prev swiper-nav-button --prev right-[6.75rem]'>
              <ArrowNav className='mr-0.5' />
            </button>
            <button type='button' className='js-insights-swiper__btn-next swiper-nav-button --next right-[2.75rem]'>
              <ArrowNav className='ml-0.5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
