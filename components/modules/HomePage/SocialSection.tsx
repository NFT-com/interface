import { useRouter } from 'next/router';

import BlurImage from 'components/elements/BlurImage';
import { Button, ButtonType } from 'components/elements/Button';
import { contentfulLoader } from 'lib/image/loader';
import { tw } from 'utils/tw';

import { HomePageV3SocialSection } from 'types/HomePage';

export interface HomePageData {
  data?: HomePageV3SocialSection;
}
export default function SocialSection({ data }: HomePageData) {
  const router = useRouter();

  return (
    <div className='pb-16 pt-6 minmd:pb-0 minmd:pt-12 minlg:pt-28'>
      {data &&
        data?.items.map((item, i) => {
          return (
            <div
              key={i}
              className={`
              z- relative grid minmd:-mt-10
              minmd:grid-cols-2 minlg:-mt-28
              minxxl:mx-auto minxxl:max-w-[100rem]${i}`}
            >
              <div
                className={tw(
                  'my-14 px-5 minmd:ml-14 minmd:px-0 minlg:my-0 minlg:ml-[13vw] minxxl:ml-[11.25%]',
                  'minmd:max-w-[24vw] minmd:pt-6 minlg:pb-[9.6rem] minlg:pt-40',
                  item.leftImage ? 'minlg:ml-[10vw]' : ''
                )}
              >
                <h2
                  data-aos='fade-up'
                  data-aos-delay='100'
                  className={tw(
                    'text-[2.9rem] font-normal leading-[1.25] minmd:text-[3.5rem] minmd:leading-none minxxl:text-[5rem]',
                    '-mr-2 mb-6 tracking-tight minxxl:mb-9'
                  )}
                >
                  {item?.titleArray.map((text, i) => {
                    return (
                      <span
                        className={`${
                          text.isOrange
                            ? 'bg-gradient-to-r from-[#FCC315] to-[#FF9C38] bg-clip-text text-transparent'
                            : ''
                        } mr-2`}
                        key={i}
                      >
                        {text?.text}
                      </span>
                    );
                  })}
                </h2>
                <p
                  data-aos='fade-up'
                  data-aos-delay='300'
                  className={tw(
                    'mb-9',
                    'text-[1rem] leading-[1.556] minlg:text-lg minlg:!leading-[1.3] minxxl:text-2xl'
                  )}
                >
                  {item.subTitle}
                </p>
                <Button
                  data-aos='zoom-out'
                  data-aos-delay='300'
                  type={ButtonType.WEB_PRIMARY}
                  label={item.buttonText}
                  stretch
                  onClick={() => router.push(`/${item?.buttonLink}`)}
                />
              </div>
              <div
                className={tw('relative', item.leftImage ? 'minmd:-order-1' : 'minlg:-ml-14')}
                data-aos='fade-up'
                data-aos-delay='400'
              >
                {i === 1 && (
                  <div
                    className={tw(
                      'h-[60%] bg-[rgba(24,26,34,.3)] blur-2xl',
                      'absolute left-[10%] right-[3%] top-1/2 mt-[10%] -translate-y-1/2'
                    )}
                  ></div>
                )}

                <BlurImage
                  width={700}
                  height={700}
                  className='drop-shadow-xl'
                  loader={contentfulLoader}
                  src={item.image.url}
                  alt='NFT image'
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
