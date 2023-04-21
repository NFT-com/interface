import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button, ButtonType } from 'components/elements/Button';
import { tw } from 'utils/tw';

import { HomePageV3BuildProfileSection } from 'types/HomePage';

export interface HomePageData {
  data?: HomePageV3BuildProfileSection;
}

export default function BuildProfile({ data }: HomePageData) {
  const router = useRouter();

  return (
    <div
      className={tw(
        'z-0 overflow-hidden bg-[#282828] pb-16 minlg:relative minlg:bg-black minlg:pb-0',
        'before:bottom-2/4 before:-z-10 minlg:before:absolute minlg:before:left-[-3%] minlg:before:right-[-3%] minlg:before:top-0 minlg:before:bg-[#282828]'
      )}
    >
      <div
        className={tw(
          'rounded-[1.875rem] bg-gradient-to-r from-[#FAC213] to-[#FF9B37]',
          'relative z-0 mx-auto max-w-[94%] overflow-hidden'
        )}
      >
        <div className={tw('minmd:flex')}>
          <div
            className={tw(
              'px-8 minmd:min-w-[26rem] minxl:w-[46%] minxl:pl-36 minxl:pr-0',
              'py-12 minlg:py-[9.5rem] minxxl:py-32'
            )}
          >
            <h2
              data-aos='fade-up'
              data-aos-delay='100'
              className={tw(
                'text-[calc(48px+62*(100vw-375px)/1545)]',
                'relative font-normal leading-[1.1] text-black',
                'mb-4 tracking-[-3px] minlg:mb-2'
              )}
            >
              <span className='text-[1em]'>{data?.title}</span>
            </h2>

            <p className={tw('mb-9 text-lg leading-[1.333]')}>{data?.subTitle}</p>
            <Button
              data-aos='zoom-out'
              data-aos-delay='300'
              type={ButtonType.WEB_SECONDARY}
              label={data?.ctaButton}
              stretch
              onClick={() => router.push(`/${data?.ctaLink}`)}
            />
          </div>

          <div className='grow text-right'>
            <Image
              className='-ml-9 h-full max-w-[calc(100%+2.25rem)] object-cover minmd:ml-auto minmd:max-w-full'
              width={721}
              height={621}
              src='/assets/build-profile-bg.webp'
              alt='Example profile image'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
