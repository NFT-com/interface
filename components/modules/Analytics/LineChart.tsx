
import { CollectionInfo, Nft } from 'graphql/generated/types';
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
import { PartialDeep } from 'type-fest';

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
  data: PartialDeep<Nft> | PartialDeep<CollectionInfo>;
  currentMarketplace: string;
  setCurrentMarketplace?: Dispatch<SetStateAction<string>>,
};

export const LineChart = ({ data, currentMarketplace, setCurrentMarketplace }: LineChartProps) => {
  const timeFrames = {
    0: '7D',
    1: '1M',
    2: '3M',
    3: '1Y',
    4: 'ALL',
  };

  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);

  const marketplaces = {
    0: 'OpenSea',
    1: 'LooksRare'
  };

  const [selectedMarketplace, setSelectedMarketplace] = useState(currentMarketplace);
  
  return (
    <div className="bg-transparent">
      <Tab.Group
        onChange={(index) => {
          setSelectedTimeFrame(timeFrames[index]);
        }}
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(timeFrames).map((timeFrame) => (
            <Tab
              key={timeFrame}
              className={({ selected }) =>
                tw(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {timeFrames[timeFrame]}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
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
    </div>
  );
};