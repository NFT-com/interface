import Image from 'next/image';

import { tw } from 'utils/tw';

import { HomePageV3BuildProfileSection } from 'types/HomePage';

import profileImage from 'public/profile-images.webp';

export interface HomePageData {
  data?: HomePageV3BuildProfileSection;
}

export default function BuildProfile({ data }: HomePageData) {
  return (
    <div
      className={tw(
        'relative z-0 overflow-hidden bg-black',
        'before:absolute before:bottom-2/4 before:left-[-3%] before:right-[-3%] before:top-0 before:-z-10 before:bg-[#282828]'
      )}
    >
      <div
        className={tw(
          'rounded-[1.875rem] bg-gradient-to-r from-[#FAC213] to-[#FF9B37]',
          'relative z-0 mx-auto max-w-[94%] overflow-hidden'
        )}
      >
        <div className={tw('minmd:flex')}>
          <div className={tw('pl-8 minmd:w-[42%] minxl:pl-36', 'py-12 minlg:py-[9.5rem] minxxl:py-32')}>
            <h2
              data-aos='fade-up'
              data-aos-delay='100'
              className={tw(
                'text-[calc(48px+54*(100vw-375px)/1545)]',
                'relative font-normal leading-[1.1] text-black',
                'mb-4 tracking-[-3px] minlg:mb-2'
              )}
            >
              <span className='text-[1em]'>{data?.title}</span>
            </h2>

            <p className={tw('mb-9 text-lg leading-[1.333]')}>{data?.subTitle}</p>
            <a
              data-aos='zoom-out'
              data-aos-delay='300'
              href={data?.ctaLink}
              className={tw(
                'rounded-full bg-[#121212] drop-shadow-lg transition-colors hover:bg-[#414141]',
                'inline-flex h-[4rem] items-center justify-center px-6 text-center minxxl:h-[6rem] minxxl:px-9',
                'text-xl font-medium uppercase text-white minxxl:text-3xl'
              )}
            >
              {data?.ctaButton}
            </a>
          </div>

          <div className='text-right minmd:w-[58%]'>
            <Image
              className='ml-auto h-full object-cover'
              width={721}
              height={621}
              src={profileImage}
              alt='Example profile image'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
