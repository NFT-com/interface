import React from 'react';
import Ticker from 'react-ticker';
import { TickerStat } from 'types';

type HomePageTickerProps = {
  tickerStats: TickerStat[];
}

export default function HomePageTicker(props: HomePageTickerProps) {
  const tickerStatsLength = Object.keys(props.tickerStats).length;
  return (
    <Ticker offset="run-in">
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
  );
}