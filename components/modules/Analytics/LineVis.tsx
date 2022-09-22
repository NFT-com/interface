import { ExternalExchange } from 'types';
import { tw } from 'utils/tw';

import { Dispatch, SetStateAction, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
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
  showMarketplaceOptions: boolean;
  currentMarketplace: string;
  setCurrentMarketplace?: Dispatch<SetStateAction<string>>,
};

export const LineVis = ({ data, showMarketplaceOptions }: LineChartProps) => {
  const [selectedMarketplace, setSelectedMarketplace] = useState<ExternalExchange>(ExternalExchange.Opensea);
  
  return (
    <div className="bg-transparent">
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
        <LineChart data={data} margin={{ top: 5, right: -30, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selectedMarketplace === 'OpenSea' ? '#00A4FF' : '#0bc355'} stopOpacity={0.2}/>
              <stop offset="80%" stopColor={selectedMarketplace === 'OpenSea' ? '#00A4FF' : '#0bc355'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          {!data &&
            <Label position={'center'} value={'No Data Yet'} />
          }
          <XAxis dataKey={'date'} />
          <YAxis orientation={'right'} />
          <Tooltip
            wrapperClassName='rounded-xl bg-[#1F2127] text-white'
            labelClassName='bg-[#1F2127] text-white'
            contentStyle={{ backgroundColor: '#1F2127' }}
          />
          <Line type="monotone" dataKey="value" stroke="#18A0FB" />
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