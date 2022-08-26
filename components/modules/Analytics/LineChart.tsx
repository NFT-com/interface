import { tw } from 'utils/tw';

import { RadioGroup, Tab } from '@headlessui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartData = [
  { name: 'Date A', value: 4000, },
  { name: 'Date B', value: 3000, },
  { name: 'Date C', value: 2000, },
  { name: 'Date D', value: 2780, },
  { name: 'Date E', value: 1890, },
  { name: 'Date F', value: 2390, },
  { name: 'Date G', value: 3490, },
  { name: 'Date A', value: 4000, },
  { name: 'Date B', value: 3000, },
  { name: 'Date C', value: 2000, },
  { name: 'Date D', value: 2780, },
  { name: 'Date E', value: 1890, },
  { name: 'Date F', value: 2390, },
  { name: 'Date G', value: 3490, },
  { name: 'Date A', value: 4000, },
  { name: 'Date B', value: 3000, },
  { name: 'Date C', value: 2000, },
  { name: 'Date D', value: 2780, },
  { name: 'Date E', value: 1890, },
  { name: 'Date F', value: 2390, },
  { name: 'Date G', value: 3490, },
];

export type LineChartProps = {
  data: any;
  currentMarketplace: string;
  setCurrentMarketplace?: Dispatch<SetStateAction<string>>,
  setCurrentTimeFrame?: Dispatch<SetStateAction<string>>
};

const timeFrames = {
  0: '1D',
  1: '7D',
  2: '1M',
  3: '3M',
  4: '1Y',
  5: 'ALL',
};

const marketplaces = {
  0: 'OpenSea',
  1: 'LooksRare'
};

export const LineChart = ({ data, currentMarketplace, setCurrentMarketplace }: LineChartProps) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(currentMarketplace);
  
  return (
    <div className="bg-transparent">
      <Tab.Group
        onChange={(index) => {
          setSelectedTimeFrame(timeFrames[index]);
        }}
      >
        <Tab.List className="flex w-3/4 ml-16 items-center order-last rounded-lg bg-[#F6F6F6] p-2 my-4">
          {Object.keys(timeFrames).map((timeFrame) => (
            <Tab
              key={timeFrame}
              className={({ selected }) =>
                tw(
                  'font-grotesk w-full rounded-lg p-1 text-xs font-semibold leading-5 text-[#6F6F6F] ',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-[#1F2127] font-medium'
                    : 'hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {timeFrames[timeFrame]}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
      <ResponsiveContainer height={270} width='100%'>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} >
          <defs>
            <linearGradient id="colorvalue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selectedMarketplace === 'OpenSea' ? '#00A4FF' : '#0bc355'} stopOpacity={0.2}/>
              <stop offset="80%" stopColor={selectedMarketplace === 'OpenSea' ? '#00A4FF' : '#0bc355'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={selectedMarketplace === 'OpenSea' ? '#00A4FF' : '#0bc355'}
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorvalue)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="w-full max-w-md px-2 py-2 sm:px-0">
        <RadioGroup value={selectedMarketplace} onChange={(index) => {setSelectedMarketplace(marketplaces[index]); setCurrentMarketplace(marketplaces[index]); }}>
          <div className="flex flex-row items-center justify-end space-x-2">
            {Object.keys(marketplaces).map((marketplace) => (
              <RadioGroup.Option
                key={marketplace}
                value={marketplace}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                      : ''
                  }
          ${
              checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
              }
            relative flex cursor-pointer rounded-full px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {marketplaces[marketplace]}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};