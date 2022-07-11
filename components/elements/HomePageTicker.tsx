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
          <div className='text-always-white text-header leading-header font-header px-12 w-full ...'>
            {props.tickerStats[`tickerStat${index+1}`].value}
          </div>
          <div className='text-always-white text-header leading-header font-header px-12 w-full pt-4 ...'>
            {props.tickerStats[`tickerStat${index+1}`].sub}
          </div>
        </>
      )}
    </Ticker>
  );
}