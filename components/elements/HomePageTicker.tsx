import { TickerStat } from 'types';

import React, { useState } from 'react';
import PageVisibility from 'react-page-visibility';
import Ticker from 'react-ticker';

type HomePageTickerProps = {
  tickerStats: TickerStat[];
}

export default function HomePageTicker(props: HomePageTickerProps) {
  const [pageIsVisible, setPageIsVisible] = useState(true);

  const tickerStatsLength = Object.keys(props.tickerStats).length;

  const handleVisibilityChange = (isVisible) => {
    setPageIsVisible(isVisible);
  };

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <Ticker move={pageIsVisible} speed={7}>
        {({ index }) => (
          <>
            <div style={{ display: 'none' }}>{index=index%tickerStatsLength}</div>
            <div className='flex items-center justify-start py-5 flex-col homeTicker'>
              <div className='text-always-white text-section leading-2 tracking-wider font-header px-9 min-w-[235px] max-w-[235px] ...'>
                {props.tickerStats[`tickerStat${index+1}`].value}
              </div>
              <div className='text-[#B6B6B6] text-body leading-2 tracking-wider whitespace-normal font-header px-9 min-w-[235px] max-w-[235px] ...'>
                {props.tickerStats[`tickerStat${index+1}`].sub}
              </div>
            </div>
          </>
        )}
      </Ticker>
    </PageVisibility>
  );
}