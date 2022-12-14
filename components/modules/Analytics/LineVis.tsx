import { ExternalExchange } from 'types';
import { tw } from 'utils/tw';

import moment from 'moment';
import { Dispatch, SetStateAction, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type LineChartProps = {
  data: any;
  label: string;
  selectedTimeFrame?: string;
  showMarketplaceOptions: boolean;
  currentMarketplace?: string;
  setCurrentMarketplace?: Dispatch<SetStateAction<string>>,
};

export const LineVis = ({ data, showMarketplaceOptions, selectedTimeFrame }: LineChartProps) => {
  const [selectedMarketplace, setSelectedMarketplace] = useState<ExternalExchange>(ExternalExchange.Opensea);

  const xAxisFormatter = (item) => {
    const xAxisTimeFrames = {
      '1D': { format: 'HH' },
      '7D': { format: 'DD' },
      '1M': { format: 'MMM DD' },
      '3M': { format: 'MMM' },
      '6M': { format: 'MMM' },
      '1Y': { format: 'MMM' },
      'ALL': { format: 'MMM' }
    };

    if (moment(item).isValid()) {
      const tick = moment(item).format(xAxisTimeFrames[selectedTimeFrame].format);
      return tick;
    } else {
      return item;
    }
  };

  const yAxisFormatter = (item) => {
    if (moment(item).isValid()) {
      return Number(item.toFixed(2)).toLocaleString('en-US');
    } else {
      return item;
    }
  };

  const CustomTooltip = (props: any) => {
    const { active, payload, dataLength } = props;
    if (active && payload && payload.length) {
      if (dataLength > 1000 && Number(payload[0].value.toFixed(0)) % 2 === 0) {
        return null;
      }
      return (
        <div className="rounded-[16px] font-medium font-noi-grotesk text-[16px] bg-[#000000] py-3 px-4">
          <p className="text-[#B2B2B2]">{`${moment(payload[0].payload.date).format('MMM D, YYYY hh:mma')}`}</p>
          <p className="text-white">{`$${Number(payload[0].value.toFixed(2)).toLocaleString('en-US')}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-transparent min-w-full">
      {(showMarketplaceOptions && !!data) &&
      <div className="w-full px-2 py-2 -mt-16 minmd:ml-[17.5px] minmd:visible sm:hidden">
        <div className="flex flex-row items-center justify-end space-x-2">
          {Object.keys(ExternalExchange).map((marketplace) => (
            <div key={marketplace} className='group'>
              {marketplace === 'LooksRare' &&
              <div
                className={tw('group-hover:opacity-100 transition-opacity bg-[#1F2127]',
                  'p-3 rounded-md absolute left-full minxl:left-1/4 -translate-x-full minxl:translate-x-1',
                  '-translate-y-full opacity-0'
                )}>
                <div className='flex flex-row w-full text-[#F9D963] font-grotesk font-semibold text-base leading-6'>
                    Coming Soon
                </div>
                <div className='flex flex-row w-32 text-white text-base font-normal leading-6'>
                  LooksRare will be supported in the future.
                </div>
              </div>
              }
              <input
                type='radio'
                name={selectedMarketplace}
                value={ExternalExchange[marketplace]}
                disabled={ExternalExchange[marketplace] === ExternalExchange.LooksRare}
                onChange={() => setSelectedMarketplace(ExternalExchange[marketplace]) }
                checked={selectedMarketplace === ExternalExchange[marketplace]}
              />
              <div className='inline-flex px-2'>{ExternalExchange[marketplace]}</div>
            </div>
          ))}
        </div>
      </div>
      }
      <ResponsiveContainer height={isMobile ? 227 : 357} width={'100%'} >
        <LineChart data={data} margin={{ top: 10, right: 30, bottom: 65, left: 5 }} height={isMobile ? 227 : 357}>
          <defs>
            <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={'#FAC213'} stopOpacity={0.2}/>
              <stop offset="80%" stopColor={'#FAC213'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          {!data &&
            <Label position='center' className='font-noi-grotesk' style={{ fontSize: '12px', height: '140px' }} value={'No Data Yet'} />
          }
          <CartesianGrid strokeDasharray="5" vertical={false} />
          <XAxis dataKey={'date'} className='font-noi-grotesk' style={{ fontSize: '12px' }} tickFormatter={xAxisFormatter}/>
          <YAxis dataKey={'value'} className='font-noi-grotesk' style={{ fontSize: '12px' }} orientation={'left'} tickFormatter={yAxisFormatter} />
          <Tooltip
            content={<CustomTooltip dataLength={data.length}/>}
          />
          <Line type="linearClosed" dataKey="value" dot={{ stroke: '#FAC213', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
      {(showMarketplaceOptions && !!data) &&
      <div className="w-full px-2 py-2 sm:px-0 visible minmd:hidden">
        <div className="flex flex-row items-center justify-end space-x-2">
          {Object.keys(ExternalExchange).map((marketplace) => (
            <div key={marketplace} className='group'>
              {ExternalExchange[marketplace] === 'LooksRare' &&
              <div
                className={tw('group-hover:opacity-100 transition-opacity bg-[#1F2127]',
                  'p-3 rounded-md absolute left-full -translate-x-full',
                  '-translate-y-full opacity-0'
                )}>
                <div className='flex flex-row w-full text-[#F9D963] font-grotesk font-semibold text-base leading-6'>
                    Coming Soon
                </div>
                <div className='flex flex-row w-32 text-white text-base font-normal leading-6'>
                  LooksRare will be supported in the future.
                </div>
              </div>
              }
              <input
                type='radio'
                name={selectedMarketplace}
                value={ExternalExchange[marketplace]}
                disabled={ExternalExchange[marketplace] === ExternalExchange.LooksRare}
                onChange={() => setSelectedMarketplace(ExternalExchange[marketplace]) }
                checked={selectedMarketplace === ExternalExchange[marketplace]}
              />
              <div className='inline-flex px-2'>{ExternalExchange[marketplace]}</div>
            </div>
          ))}
        </div>
      </div>
      }
    </div>
  );
};