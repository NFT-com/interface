import BlurImage from 'components/elements/BlurImage';
import { HomePageV3WhatWeCanDo } from 'types/HomePage';
import { getStaticAsset } from 'utils/helpers';
import { tw } from 'utils/tw';

import React from 'react';

export interface HomePageData {
  data: HomePageV3WhatWeCanDo;
}
export default function WhatWeCanDo({ data }: HomePageData) {
  return (
    <section
      className='py-9 minlg:pt-20 minlg:pb-36 minxl:pb-40'
      style={{
        background: 'url("/bg-profile.webp") no-repeat 50% 100%/100% auto'
      }}
    >
      <div className='mx-auto max-w-[89.333%] minxl:max-w-[56.5%]'>
        <h2 data-aos="fade-up" className={tw(
          'text-[2.625rem] minmd:text-[3.75rem] minxl:text-[5.625rem] minxxl:text-[6.1vw]',
          'leading-snug minxl:leading-none font-normal text-black tracking-tight',
          'mb-14 minxl:mb-9 minxl:-mr-16 minlg:pl-3'
        )}>
          {data?.whatWeCanDoTitle.gradientTitle?.blackWord}
          <span
            className={tw(
              'ml-1 bg-gradient-to-r from-[#FCC315] to-[#FF9C38] bg-clip-text text-transparent'
            )}
          >
            {data?.whatWeCanDoTitle.gradientTitle?.orangeWord}
          </span>
        </h2>

        <div
          className='rounded-2xl'
          style={{
            filter:
              'drop-shadow(0px 95.2772px 76.2218px rgba(0, 0, 0, 0.07)) drop-shadow(0px 39.8045px 31.8436px rgba(0, 0, 0, 0.0503198)) drop-shadow(0px 21.2814px 17.0251px rgba(0, 0, 0, 0.0417275)) drop-shadow(0px 11.9302px 9.54415px rgba(0, 0, 0, 0.035)) drop-shadow(0px 6.33603px 5.06883px rgba(0, 0, 0, 0.0282725)) drop-shadow(0px 2.63656px 2.10925px rgba(0, 0, 0, 0.0196802))'
          }}
        >
          <BlurImage width={955} height={520} src={data?.whatWeCanDoImage.url} className='rounded-2xl w-full h-auto' alt="Browser Screen" />
        </div>
      </div>
    </section>
  );
}
