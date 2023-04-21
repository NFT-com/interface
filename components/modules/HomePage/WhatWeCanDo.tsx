import BlurImage from 'components/elements/BlurImage';
import { contentfulLoader } from 'lib/image/loader';
import { tw } from 'utils/tw';

import { HomePageV3WhatWeCanDo } from 'types/HomePage';

export interface HomePageData {
  data: HomePageV3WhatWeCanDo;
}
export default function WhatWeCanDo({ data }: HomePageData) {
  return (
    <section
      className='py-9 minlg:pb-36 minlg:pt-20 minxl:pb-40'
      style={{
        background: `url("${data?.whatWeCanDoBg?.url}") no-repeat 50% 100%/100% auto`
      }}
    >
      <div className='mx-auto max-w-[89.333%] minxl:max-w-[56.5%]'>
        <h2
          data-aos='fade-up'
          className={tw(
            'text-[2.625rem] minmd:text-[3.75rem] minxl:text-[5.625rem] minxxl:text-[6.1vw]',
            'font-normal leading-snug tracking-tight text-black minxl:leading-none',
            'mb-14 minlg:pl-3 minxl:-mr-16 minxl:mb-9'
          )}
        >
          {data?.whatWeCanDoTitle?.gradientTitle?.blackWord}
          <span className={tw('ml-1 bg-gradient-to-r from-[#FCC315] to-[#FF9C38] bg-clip-text text-transparent')}>
            {data?.whatWeCanDoTitle?.gradientTitle?.orangeWord}
          </span>
        </h2>

        <div className='-mx-[9%]'>
          <BlurImage
            loader={contentfulLoader}
            width={955}
            height={520}
            src={data?.whatWeCanDoImage?.url}
            className='h-auto w-full rounded-2xl'
            alt='Browser Screen'
          />
        </div>
      </div>
    </section>
  );
}
