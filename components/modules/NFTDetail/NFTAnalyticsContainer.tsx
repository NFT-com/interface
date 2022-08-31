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

const marketplaces = {
  0: 'OpenSea',
  1: 'LooksRare'
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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);

  const [nftData, setNftData] = useState(null);

  return (
    <div className="bg-transparent">
      <div className="w-full minmd:px-40">
        <div className='w-full minmd:pb-4 minxl:-ml-40 py-2'>
          <Tab.Group onChange={(index) => {setSelectedChartType(nftChartTypes[index]);}}>
            <Tab.List className="flex w-full space-x-1 rounded-3xl bg-[#F6F6F6] font-grotesk">
              {Object.keys(nftChartTypes).map((chartType) => (
                <Tab
                  key={chartType}
                  className={({ selected }) =>
                    tw(
                      'w-full rounded-3xl py-2.5 text-sm font-medium leading-5 text-[#6F6F6F]',
                      selected
                      && 'bg-black text-[#F8F8F8]'
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
          <Tab.List className="flex w-[250px] ml-9 py-2 minmd:-ml-40 items-center order-last rounded-lg bg-[#F6F6F6] p-2">
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