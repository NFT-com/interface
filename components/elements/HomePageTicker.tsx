import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import PageVisibility from 'react-page-visibility';

import { TickerStat } from 'types';

type HomePageTickerProps = {
  tickerStats: TickerStat[];
};

export default function HomePageTicker(props: HomePageTickerProps) {
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const handleVisibilityChange = isVisible => {
    setPageIsVisible(isVisible);
  };

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <Marquee gradient={false} play={pageIsVisible} speed={7} loop={0}>
        {props.tickerStats.map(({ stat }) => (
          <>
            <div className='homeTicker flex flex-col items-center justify-start py-5'>
              <div className='leading-2 ... min-w-[235px] max-w-[235px] px-9 text-section font-header tracking-wider text-always-white'>
                {stat.value}
              </div>
              <div className='leading-2 ... min-w-[235px] max-w-[235px] whitespace-normal px-9 text-body font-header tracking-wider text-[#B6B6B6]'>
                {stat.sub}
              </div>
            </div>
          </>
        ))}
      </Marquee>
    </PageVisibility>
  );
}
