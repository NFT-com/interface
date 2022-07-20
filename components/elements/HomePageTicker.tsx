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
          <div className='flex items-center py-5 flex-col homeTicker'>
            <div className='text-always-white text-section leading-2 font-header px-12 w-full ...'>
              {props.tickerStats[`tickerStat${index+1}`].value}
            </div>
            <div className='text-[#B6B6B6] text-body leading-2 font-header px-12 w-full ...'>
              {props.tickerStats[`tickerStat${index+1}`].sub}
            </div>
          </div>
        </>
      )}
    </Ticker>
  );
}