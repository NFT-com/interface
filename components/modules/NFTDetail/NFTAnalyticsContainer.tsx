import { NFTActivity } from 'components/modules/Analytics/NFTActivity';
import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { PartialDeep } from 'type-fest';

export type NFTAnalyticsContainerProps = {
  data: PartialDeep<Nft>;
}

const nftChartTypes = {
  1: 'Activity',
};

const timeFrames = {
  0: '1D',
  1: '7D',
  2: '1M',
  3: '3M',
  4: '1Y',
  5: 'ALL'
};

export const NFTAnalyticsContainer = ({ data }: NFTAnalyticsContainerProps) => {
  const [selectedChartType, setSelectedChartType] = useState(nftChartTypes[1]);
  const [, setSelectedTimeFrame] = useState(timeFrames[0]);

  const [nftData,] = useState(null);

  return (
    <div className="bg-transparent overflow-x-auto p-4 minxl:p-10 minxl:pt-10 minxl:-mb-10">
      <div className="w-full flex flex-col">
        <div className='justify-start flex'>
          <Tab.Group onChange={(index) => {setSelectedChartType(nftChartTypes[index]);}}>
            <Tab.List className="flex rounded-3xl bg-[#F6F6F6] font-grotesk">
              {Object.keys(nftChartTypes).map((chartType) => (
                <Tab
                  key={chartType}
                  className={({ selected }) =>
                    tw(
                      'rounded-3xl py-2.5 px-8 text-sm font-medium leading-5 text-[#6F6F6F]',
                      selected && 'bg-black text-[#F8F8F8]'
                    )
                  }
                >
                  {nftChartTypes[chartType]}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        {nftData && selectedChartType !== 'Activity' &&
        <Tab.Group
          onChange={(index) => {
            setSelectedTimeFrame(timeFrames[index]);
          }}
        >
          <Tab.List className="flex w-[250px] ml-9 minmd:-ml-40 items-center order-last rounded-lg bg-[#F6F6F6] p-2">
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
        }
      </div>
      <NFTActivity data={data} />
    </div>
  );
};