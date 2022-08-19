import { Collection, Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { RadioGroup, Tab } from '@headlessui/react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const chartData = [
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
  { name: 'Page A', uv: 4000, },
  { name: 'Page B', uv: 3000, },
  { name: 'Page C', uv: 2000, },
  { name: 'Page D', uv: 2780, },
  { name: 'Page E', uv: 1890, },
  { name: 'Page F', uv: 2390, },
  { name: 'Page G', uv: 3490, },
];

export type GrpahViewProps = {
  data: Nft | Collection;
}

export const LineChart = () => {
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

  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);

  const chartTypes = {
    0: 'Price',
    1: 'Volume',
    2: 'Activity'
  };
  
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);

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
        <RadioGroup value={selectedMarketplace} onChange={(index) => {setSelectedMarketplace(marketplaces[index]);}}>
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

      <div className="w-full max-w-md px-2 sm:px-0">
        <Tab.Group onChange={(index) => {setSelectedChartType(chartTypes[index]);}}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {Object.keys(chartTypes).map((chartType) => (
              <Tab
                key={chartType}
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
                {chartTypes[chartType]}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
      <ResponsiveContainer height={270} width='100%'>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00A4FF" stopOpacity={0.2}/>
              <stop offset="80%" stopColor="#00A4FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#00A4FF"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};