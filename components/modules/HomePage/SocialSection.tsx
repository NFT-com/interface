import BlurImage from 'components/elements/BlurImage';
import { HomePageV3SocialSection } from 'types/HomePage';
import { tw } from 'utils/tw';

import { contentfulLoader } from 'lib/image/loader';
export interface HomePageData {
  data?: HomePageV3SocialSection;
}
export function SocialSection({ data }: HomePageData) {
  return(
    <div className="pt-6 pb-16 minlg:pb-0 minmd:pt-28 minxl:pt-32 minxxl:pt-40">
      {
        data && data?.items.map((item, i) => {
          return (
            <div key={i} className={`grid minmd:grid-cols-2 items-center minmd:-mt-20 minxl:-mt-24
              relative z-${i}`}>
              <div className={tw(
                'my-14 minlg:my-0 px-5 minmd:px-0 minmd:ml-[14.7vw]',
                'minmd:max-w-[25rem] minxxl:max-w-[29vw] minlg:pb-[9.6rem]'
              )}>
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.25] minxl:leading-none font-normal',
                  'tracking-tight mb-6 minxxl:mb-9'
                )}>
                  {
                    item?.titleArray.map((text,i) => {
                      return (
                        <span className={`${text.isOrange ? 'bg-clip-text text-transparent bg-gradient-to-r from-[#FCC315] to-[#FF9C38]' : ''} mr-2`} key={i}>{text?.text}</span>
                      );
                    })
                  }
                </h2>
                <p
                  data-aos='fade-up'
                  data-aos-delay='300'
                  className={tw(
                    'mb-9',
                    'text-[1rem] leading-[1.556] minlg:text-lg minlg:!leading-[1.3] minxxl:text-[2rem]'
                  )}
                >
                  {item.subTitle}
                </p>
                <a
                  href={item.buttonLink}
                  className={tw(
                    'rounded-full bg-[#F9D54C] drop-shadow-lg transition-colors hover:bg-[#dcaf07]',
                    'inline-flex h-[4rem] items-center justify-center px-6 minxxl:h-[6rem] minxxl:px-9',
                    'w-full text-xl font-medium uppercase text-black minmd:w-auto minxxl:text-3xl'
                  )}
                >
                  {item.buttonText}
                </a>
              </div>

              <div className={item.leftImage ? 'minmd:-order-1 minlg:-mr-20' : 'minlg:-ml-14'} data-aos="fade-up" data-aos-delay="400">
                <BlurImage
                  width={700}
                  height={700}
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
