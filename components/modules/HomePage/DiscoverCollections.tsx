import BlurImage from 'components/elements/BlurImage';
import { HomePageV2 } from 'types';
import { getBaseUrl } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import Link from 'next/link';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface HomePageData {
  data?: HomePageV2;
}

export function DiscoverCollections({ data }: HomePageData) {
  return(
    <div id='anim-discover-trigger' className={tw(
      'bg-black relative',
      'minlg:before:w-40 minlg:before:absolute minlg:before:left-[2.5rem] minlg:before:top-0 minlg:before:h-[1.875rem] before:bg-white before:skew-x-[-20deg]',
      'minlg:after:w-[8.9rem] minlg:after:absolute minlg:after:left-[11.5rem] minlg:after:top-0 minlg:after:h-[5.5rem] after:bg-white after:skew-x-[-20deg]'
    )}>
      <div className={tw(
        'pl-5 minmd:pl-0',
        'relative z-0 py-[2.5rem] minlg:pt-[6.25rem] minlg:pb-12',
      )}>
        <div className='relative minlg:text-center'>
          <h2 data-aos="fade-up" className={tw(
            'text-[3rem] minmd:text-[3.75rem] minxl:text-[5.125rem] minxxl:text-[7.5rem] leading-[1.0854] font-normal text-white',
            'mb-10 minmd:mb-[6.625rem]'
          )}>Discover Collections</h2>
        </div>

        <div className='overflow-hidden mb-12'>
          <div id='anim-discover-content' data-aos="fade-left" className='minlg:translate-x-full minlg:transform-gpu'>
            <Swiper
              modules={[Scrollbar]}
              spaceBetween={16}
              breakpoints={{
                0: {
                  slidesPerView: 1.15,
                },
                600: {
                  slidesPerView: 2,
                },
                1200: {
                  slidesPerView: 2.5,
                },
                1600: {
                  slidesPerView: 3.5,
                }
              }}
              autoplay={{
                'delay': 3500,
                'disableOnInteraction': false
              }}
              scrollbar={{ draggable: true }}
              className='flex !pb-12 minxl:!pb-[4.875rem]'>
              {data?.newsSlidesCollection?.items.map((preview) =>
                <SwiperSlide key={preview.slug} className='!h-auto'>
                  <Link key={preview.slug} href={`articles/${preview.slug}`} className={tw(
                    'bg-white flex flex-col flex-shrink-0 rounded-2xl md:mb-5 text-black',
                    'h-full cursor-pointer'
                  )}>
                    <div className='before:pb-[40.249%] before:block relative overflow-hidden'>
                      <BlurImage
                        fill
                        className='rounded-t-2xl object-cover'
                        src={`${getBaseUrl('https://www.nft.com/')}api/imageFetcher?gcp=false&url=${encodeURIComponent(preview?.heroImage?.url)}`}
                        alt={preview.title}
                      />
                    </div>

                    <div className='py-5 px-4 minxxl:py-8 minxxl:px-7 flex-grow flex flex-col items-start'>
                      <h3 className={tw(
                        'text-[1.125rem] minlg:text-[2rem] minxxl:text-[2.75rem] leading-[1.09375] font-semibold',
                        'mb-11 minxxl:mb-16'
                      )}>{preview.title}</h3>
                      <div className='flex items-center mt-auto text-xs minlg:text-xl minxxl:text-3xl font-medium text-[#605A45]/60'>
                        <div className={tw(
                          'relative rounded-full mr-[6px] minlg:mr-3 block object-cover',
                          'h-5 minlg:h-9 minxxl:h-12 w-5 minlg:w-9 minxxl:w-12'
                        )}>
                          <Image fill className='object-cover rounded-full' src={preview.author?.image?.url} alt={`Image for author, ${preview.author?.name}`} />
                        </div>
                        {preview.author?.name}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>

        <div data-aos="zoom-in" data-aos-delay="100" className='text-center'>
          <a href={data?.newsCta?.link} className={tw(
            'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
            'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
            'text-xl minxxl:text-3xl text-black font-medium uppercase'
          )}>View all collections</a>
        </div>
      </div>
    </div>
  );
}
