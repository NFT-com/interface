import BlurImage from 'components/elements/BlurImage';
import { HomePageV3SocialSection } from 'types';
import { tw } from 'utils/tw';

import { contentfulLoader } from 'lib/image/loader';
export interface HomePageData {
  data?: HomePageV3SocialSection;
}
export function SocialSection({ data }: HomePageData) {
  return(
    <div className="pt-8 minxxl:pt-16 pb-2">
      {
        data && data?.textAndImageCollection?.items.map((item, i) => {
          return (
            <div key={i} className='grid minmd:grid-cols-2 items-center'>
              <div className='px-5 minmd:px-0 minmd:ml-[14.7vw] minmd:max-w-[25rem] minxxl:max-w-[29vw] minlg:pb-[9.6rem]'>
                <h2 data-aos="fade-up" data-aos-delay="100" className={tw(
                  'text-[3rem] minmd:text-[3.75rem] minxxl:text-[5rem] leading-[1.2] font-normal',
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
                <p data-aos="fade-up" data-aos-delay="300" className={tw(
                  'mb-9',
                  'text-[1rem] minlg:text-lg minxxl:text-[2rem] leading-[1.556] minlg:!leading-[1.3]'
                )}>{item.subTitle}</p>
                <a href={item.buttonLink} className={tw(
                  'bg-[#F9D54C] hover:bg-[#dcaf07] drop-shadow-lg rounded-full transition-colors',
                  'inline-flex items-center justify-center h-[4rem] minxxl:h-[6rem] px-6 minxxl:px-9',
                  'text-xl minxxl:text-3xl text-black font-medium uppercase w-full minmd:w-auto'
                )}>{item.buttonText}</a>
              </div>

              <div className={item.leftImage ? 'minmd:-order-1 minlg:-mr-20' : ''} data-aos="fade-up" data-aos-delay="400">
                <BlurImage
                  width={700}
                  height={700}
                  loader={contentfulLoader}
                  src={item.image.url}
                  alt="NFT image" />
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
