import BlurImage from 'components/elements/BlurImage';
import { HomePageV3BlogSection } from 'types/HomePage';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import { contentfulLoader } from 'lib/image/loader';
import Link from 'next/link';
import ArrowNav from 'public/icons/arrow-right.svg?svgr';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface HomePageData {
  data?: HomePageV3BlogSection;
  blogSectionTitle:{
    title: string,
    subTitle: string,
  }
  goToBlogButton: {
    title: string,
    link: string,
  }
}

export function BlogSection({ data, goToBlogButton, blogSectionTitle }: HomePageData) {
  return(
    <div className='bg-[#282828]'>
      <div className={tw(
        'relative z-0 py-[2.5rem] minlg:pt-[6.25rem] minlg:pb-[7.625rem]',
      )}>
        <div className='relative text-center text-white'>
          <h2 data-aos="fade-up" className='text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal mb-[.625rem]'>{blogSectionTitle?.title}</h2>
          <p data-aos="fade-up" data-aos-delay="100" className='text-lg mb-[3.75rem]'>{blogSectionTitle?.subTitle}</p>
        </div>

        <div className='mb-12' data-aos="fade-left">
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={14}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
              },
              600: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3.3,
              },
              1921: {
                slidesPerView: 4.3,
              }
            }}
            navigation={{
              nextEl: '.insights-swiper__btn-next',
              prevEl: '.insights-swiper__btn-prev',
              disabledClass: 'swiper-button-disabled'
            }}
            autoplay={{
              'delay': 3500,
              'disableOnInteraction': false
            }}
            className='insights-swiper flex !pl-[4vw]'>
            {data?.items.map((preview ) =>
              <SwiperSlide key={preview.slug} className='!h-auto'>
                <Link key={preview.slug} href={`articles/${preview.slug}`} className={tw(
                  'bg-white flex flex-col flex-shrink-0 h-full rounded-lg md:mb-5 text-black',
                  'cursor-pointer',
                )}>
                  <div className='before:pb-[66.5%] before:block relative overflow-hidden'>
                    <BlurImage
                      fill
                      className='rounded-t-lg object-cover'
                      src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview?.heroImage?.url)}`}
                      alt={preview.title}
                      loader={contentfulLoader}
                    />
                  </div>

                  <div className='py-5 px-4 minxxl:py-8 minxxl:px-7 flex-grow flex flex-col items-start'>
                    <h3 className={tw(
                      'text-[1.125rem] minlg:text-[2rem] minxxl:text-[2.75rem] leading-[1.09375] ',
                      'mb-11 minxxl:mb-16'
                    )}>{preview.title}</h3>
                    <div className='flex items-center mt-auto text-xs minlg:text-xl minxxl:text-3xl font-medium text-[#605A45]/60'>
                      <div className={tw(
                        'relative rounded-full mr-[6px] minlg:mr-3 block object-cover',
                        'h-5 minlg:h-9 minxxl:h-12 w-5 minlg:w-9 minxxl:w-12'
                      )}>
                        <BlurImage
                          fill
                          className='object-cover rounded-full'
                          src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview.author?.image?.url)}`}
                          alt={`Image for author, ${preview.author?.name}`}
                          loader={contentfulLoader}
                        />
                      </div>
                      {preview.author?.name}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100" className='text-center relative flex flex-col minmd:block'>
          <a href={goToBlogButton?.link} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase'
          )}>{goToBlogButton?.title.toUpperCase()}</a>

          <div className="insights-swiper__buttons -order-1 pb-5 minmd:pb-0">
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
