import BlurImage from 'components/elements/BlurImage';
import { contentfulLoader } from 'lib/image/loader';
import { tw } from 'utils/tw';

import { HomePageV3SocialSection } from 'types/HomePage';

export interface HomePageData {
  data?: HomePageV3SocialSection;
}
export default function SocialSection({ data }: HomePageData) {
  return (
    <div className='pb-2 pt-8 minxxl:pt-16'>
      {data &&
        data?.items.map((item, i) => {
          return (
            <div key={i} className='grid items-center minmd:grid-cols-2'>
              <div className='px-5 minmd:ml-[14.7vw] minmd:max-w-[25rem] minmd:px-0 minlg:pb-[9.6rem] minxxl:max-w-[29vw]'>
                <h2
                  data-aos='fade-up'
                  data-aos-delay='100'
                  className={tw(
                    'text-[3rem] font-normal leading-[1.2] minmd:text-[3.75rem] minxxl:text-[5rem]',
                    'mb-6 tracking-tight minxxl:mb-9'
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

              <div
                className={item.leftImage ? 'minmd:-order-1 minlg:-mr-20' : ''}
                data-aos='fade-up'
                data-aos-delay='400'
              >
                <BlurImage width={700} height={700} loader={contentfulLoader} src={item.image.url} alt='NFT image' />
              </div>
            </div>
          );
        })}
    </div>
  );
}
