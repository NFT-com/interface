import Link from 'next/link';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import BlurImage from 'components/elements/BlurImage';
import { contentfulLoader } from 'lib/image/loader';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import { HomePageV3BlogSection } from 'types/HomePage';

import ArrowNav from 'public/icons/arrow-right.svg?svgr';

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

export default function BlogSection({ data, goToBlogButton, blogSectionTitle }: HomePageData) {
  return (
    <div className='bg-[#282828]'>
      <div className={tw('relative z-0 py-[2.5rem] minlg:pb-[7.625rem] minlg:pt-[6.25rem]')}>
        <div className='relative text-center text-white'>
          <h2
            data-aos='fade-up'
            className='mb-[.625rem] text-[3rem] font-normal leading-[1.0854] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem]'
          >
            {blogSectionTitle?.title}
          </h2>
          <p data-aos='fade-up' data-aos-delay='100' className='mb-[3.75rem] text-lg'>
            {blogSectionTitle?.subTitle}
          </p>
        </div>

        <div className='mb-12' data-aos='fade-left'>
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
              nextEl: '.insights-swiper__btn-next',
              prevEl: '.insights-swiper__btn-prev',
              disabledClass: 'swiper-button-disabled'
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false
            }}
            className='insights-swiper flex !pl-[4vw]'
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

        <div data-aos='zoom-in' data-aos-delay='100' className='relative flex flex-col text-center minmd:block'>
          <a
            href={goToBlogButton?.link}
            className={tw(
              'rounded-full bg-[#F9D54C] drop-shadow-lg transition-colors hover:bg-[#dcaf07]',
              'inline-flex h-[4rem] items-center justify-center px-6 minxxl:h-[6rem] minxxl:px-9',
              'text-xl font-medium uppercase text-black minxxl:text-3xl'
            )}
          >
            {goToBlogButton?.title.toUpperCase()}
          </a>

          <div className='insights-swiper__buttons -order-1 pb-5 minmd:pb-0'>
            <button type='button' className='insights-swiper__btn-prev'>
              <ArrowNav />
            </button>
            <button type='button' className='insights-swiper__btn-next'>
              <ArrowNav />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
