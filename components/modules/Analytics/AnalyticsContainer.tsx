import { Collection, Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { LineChart } from './LineChart';
import { TxHistory } from './TxHistory';

import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { PartialDeep } from 'type-fest';

export type AnalyticsContainerProps = {
  data: PartialDeep<Nft> | Collection;
}

export const AnalyticsContainer = ({ data }:AnalyticsContainerProps) => {
  const chartTypes = {
    0: 'Price',
    1: 'Volume',
    2: 'Activity'
  };
  
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);

  return (
    <div className="bg-transparent">
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

      {(selectedChartType === 'Price' || selectedChartType === 'Volume') && <LineChart data={data} />}
      {selectedChartType === 'Activity' && <TxHistory />}
    </div>
  );
};