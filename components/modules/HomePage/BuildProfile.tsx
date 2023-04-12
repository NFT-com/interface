import { HomePageV2 } from 'types';
import { tw } from 'utils/tw';

import Image from 'next/image';
import profileImage from 'public/profile-images.webp';

export interface HomePageData {
  data?: HomePageV2;
}

export function BuildProfile({ data }: HomePageData) {
  return(
    <div className={tw(
      'bg-black relative overflow-hidden z-0',
      'before:absolute before:left-[-3%] before:right-[-3%] before:top-0 before:bottom-2/4 before:bg-[#282828] before:-z-10'
    )}>
      <div className={tw(
        'bg-gradient-to-r from-[#FAC213] to-[#FF9B37] rounded-[1.875rem]',
        'relative z-0 max-w-[94%] mx-auto overflow-hidden'
      )}>
        <div className={tw(
          'minmd:flex'
        )}>
          <div className={tw(
            'minmd:w-[42%] pl-8 minxl:pl-36',
            'py-12 minlg:py-[9.5rem] minxxl:py-32'
          )}>
            <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
              'text-[calc(48px+54*(100vw-375px)/1545)]',
              'text-black font-normal leading-[1.1] relative',
              'mb-4 minlg:mb-2 tracking-[-3px]'
            )}>
              <span className='text-[1em]'>
                      Build your
              </span>
              <span
                data-aos="fade-up"
                data-aos-delay="200"
                className={tw(
                  'text-[1em] block'
                )}>
                      NFT
                      Profile
              </span>
            </h2>

            <p className={tw(
              'text-lg leading-[1.333] mb-9'
            )}>Join other 10k NFT profiles!</p>
            <a data-aos="zoom-out" data-aos-delay="300" href={data?.bynpCta?.link} className={tw(
              'bg-[#121212] hover:bg-[#414141] transition-colors drop-shadow-lg rounded-full',
              'inline-flex items-center justify-center text-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
              'text-xl minxxl:text-3xl text-white font-medium uppercase'
            )}>{data?.bynpCta?.title}</a>
          </div>

          <div className='minmd:w-[58%] text-right'>
            <Image className='ml-auto h-full object-cover' src={profileImage} alt='' />
          </div>
        </div>
      </div>
    </div>
  );
}
