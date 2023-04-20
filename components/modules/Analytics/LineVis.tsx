import { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment';
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { tw } from 'utils/tw';

import { ExternalExchange } from 'types';

export type LineChartProps = {
  data: any;
  label: string;
  selectedTimeFrame?: string;
  showMarketplaceOptions: boolean;
  currentMarketplace?: string;
  setCurrentMarketplace?: Dispatch<SetStateAction<string>>;
};

export const LineVis = ({ data, showMarketplaceOptions, selectedTimeFrame }: LineChartProps) => {
  const [selectedMarketplace, setSelectedMarketplace] = useState<ExternalExchange>(ExternalExchange.Opensea);

  const parseTimestamp = (timestampString: string): number => {
    // Create a Date object from the timestamp string
    const date = new Date(timestampString);
    // Convert the Date object to a Unix timestamp
    const unixTimestamp = date.getTime();
    return unixTimestamp;
  };

  data = data.map(i => {
    return { ...i, date: parseTimestamp(i.date) };
  });

  const xAxisFormatter = item => {
    const xAxisTimeFrames = {
      '1D': { format: 'HH' },
      '7D': { format: 'DD' },
      '1M': { format: 'MMM DD' },
      '3M': { format: 'MMM DD' },
      '6M': { format: 'MMM DD' },
      '1Y': { format: 'MMM DD' },
      ALL: { format: 'MMM DD' }
    };

    if (moment(item).isValid()) {
      const tick = moment(item).format(xAxisTimeFrames[selectedTimeFrame].format);
      return tick;
    }
    return item;
  };

  const abbreviateNumber = (number: number): string => {
    if (number >= 1000000000) {
      return `${(number / 1000000000).toFixed(1)}B`;
    }
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return Number(number.toFixed(2)).toLocaleString('en-US');
  };

  const yAxisFormatter = item => {
    if (moment(item).isValid()) {
      return `$${abbreviateNumber(Number(item))}`;
    }
    return item;
  };

  const ChartCustomTooltip = (props: any) => {
    const { active, payload, dataLength } = props;
    if (active && payload && payload.length) {
      if (dataLength > 1000 && Number(payload[0].value.toFixed(0)) % 2 === 0) {
        return null;
      }
      return (
        <div className='rounded-[16px] bg-[#000000] px-4 py-2 font-noi-grotesk text-[16px] font-medium'>
          <p className='text-[#B2B2B2]'>{`${moment(payload[0].payload.date).format('dddd, MMM Do YY')}`}</p>
          <p className='text-white'>{`$${Number(payload[0].value.toFixed(2)).toLocaleString('en-US')}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='min-h-[320px] min-w-full bg-transparent'>
      {showMarketplaceOptions && !!data && (
        <div className='-mt-16 w-full p-2 minmd:visible minmd:ml-[17.5px] sm:hidden'>
          <div className='flex flex-row items-center justify-end space-x-2'>
            {Object.keys(ExternalExchange).map(marketplace => (
              <div key={marketplace} className='group'>
                {marketplace === 'LooksRare' && (
                  <div
                    className={tw(
                      'bg-[#1F2127] transition-opacity group-hover:opacity-100',
                      'absolute left-full -translate-x-full rounded-md p-3 minxl:left-1/4 minxl:translate-x-1',
                      '-translate-y-full opacity-0'
                    )}
                  >
                    <div className='flex w-full flex-row font-noi-grotesk text-base font-semibold leading-6 text-[#F9D963]'>
                      Coming Soon
                    </div>
                    <div className='flex w-32 flex-row text-base font-normal leading-6 text-white'>
                      LooksRare will be supported in the future.
                    </div>
                  </div>
                )}
                <input
                  type='radio'
                  name={selectedMarketplace}
                  value={ExternalExchange[marketplace]}
                  disabled={ExternalExchange[marketplace] === ExternalExchange.LooksRare}
                  onChange={() => setSelectedMarketplace(ExternalExchange[marketplace])}
                  checked={selectedMarketplace === ExternalExchange[marketplace]}
                />
                <div className='inline-flex px-2'>{ExternalExchange[marketplace]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ResponsiveContainer height={320} width={'100%'}>
        <LineChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 0 }} height={320}>
          <defs>
            <linearGradient id='colorvalue' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor={'#FAC213'} stopOpacity={0.2} />
              <stop offset='80%' stopColor={'#FAC213'} stopOpacity={0} />
            </linearGradient>
          </defs>
          {!data && (
            <Label
              position='center'
              className='font-noi-grotesk'
              style={{ fontSize: '13px', height: '140px' }}
              value={'No Data Yet'}
            />
          )}
          <CartesianGrid strokeDasharray='3-3' stroke='#E6E6E6' vertical={false} />
          <XAxis
            axisLine={false}
            tickLine={false}
            dataKey={'date'}
            tickCount={7}
            type='number'
            domain={['dataMin', 'dataMax']}
            className='font-noi-grotesk'
            style={{ color: '#4D4D4D', fontSize: '13px' }}
            tickFormatter={xAxisFormatter}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            dataKey={'value'}
            tickCount={6}
            className='font-noi-grotesk'
            style={{ color: '#4D4D4D', fontSize: '13px' }}
            orientation={'left'}
            tickFormatter={yAxisFormatter}
          />
          <Tooltip cursor={false} content={<ChartCustomTooltip dataLength={data.length} />} />
          <Line
            type='linear'
            isAnimationActive={true}
            dataKey='value'
            stroke='#FCE795'
            strokeWidth={4}
            activeDot={{ stroke: '#FAC213', fill: '#FAC213', r: 5, strokeWidth: 5 }}
            dot={{ stroke: '#FAC213', fill: '#FAC213', r: 5, strokeWidth: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {showMarketplaceOptions && !!data && (
        <div className='visible w-full p-2 minmd:hidden sm:px-0'>
          <div className='flex flex-row items-center justify-end space-x-2'>
            {Object.keys(ExternalExchange).map(marketplace => (
              <div key={marketplace} className='group'>
                {ExternalExchange[marketplace] === 'LooksRare' && (
                  <div
                    className={tw(
                      'bg-[#1F2127] transition-opacity group-hover:opacity-100',
                      'absolute left-full -translate-x-full rounded-md p-3',
                      '-translate-y-full opacity-0'
                    )}
                  >
                    <div className='flex w-full flex-row font-noi-grotesk text-base font-semibold leading-6 text-[#F9D963]'>
                      Coming Soon
                    </div>
                    <div className='flex w-32 flex-row text-base font-normal leading-6 text-white'>
                      LooksRare will be supported in the future.
                    </div>
                  </div>
                )}
                <input
                  type='radio'
                  name={selectedMarketplace}
                  value={ExternalExchange[marketplace]}
                  disabled={ExternalExchange[marketplace] === ExternalExchange.LooksRare}
                  onChange={() => setSelectedMarketplace(ExternalExchange[marketplace])}
                  checked={selectedMarketplace === ExternalExchange[marketplace]}
                />
                <div className='inline-flex px-2'>{ExternalExchange[marketplace]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
