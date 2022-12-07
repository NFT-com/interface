import { LineVis } from 'components/modules/Analytics/LineVis';
import { NFTActivity as StaticNFTActivity } from 'components/modules/Analytics/NFTActivity';
import { Nft } from 'graphql/generated/types';
import { useGetSales } from 'graphql/hooks/useGetSales';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

export type NFTAnalyticsContainerProps = {
  data: PartialDeep<Nft>;
}

const nftActivityTabs = {
  0: 'Activity',
  1: 'Sales',
};

const timeFrames = {
  0: '1D',
  1: '7D',
  2: '1M',
  3: '3M',
  4: '6M',
  5: '1Y',
  6: 'ALL'
};

const DynamicNFTActivity = dynamic<React.ComponentProps<typeof StaticNFTActivity>>(() => import('components/modules/Analytics/NFTActivity').then(mod => mod.NFTActivity));

export const NFTAnalyticsContainer = ({ data }: NFTAnalyticsContainerProps) => {
  const [selectedTab, setSelectedTab] = useState(nftActivityTabs[0]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[6]);
  const { getSales } = useGetSales();

  const { data: nftData } = useSWR('getSales' + data?.contract + data?.tokenId + selectedTimeFrame, async () => {
    const dayTimeFrames = {
      '1D': '24h',
      '7D': '7d',
      '1M': '30d',
      '3M': '90d',
      '6M': '6m',
      '1Y': '1y',
      'ALL': 'all'
    };

    const resp = await getSales({
      contractAddress: data?.contract,
      tokenId: BigNumber.from(data?.tokenId).toString(),
      dateRange: dayTimeFrames[selectedTimeFrame] });

    const sales = resp.getSales.map(i => {
      return { date: i.date, value: i.priceUSD };
    });
    return sales.sort((a,b) =>(a.date > b.date) ? 1 : -1);
  });

  return (
    <div className="bg-transparent overflow-x-auto p-4 minxl:p-5 minxl:pb-0 minxl:-mb-10 w-full">
      <div className="w-full flex flex-col">
        <div className='justify-start flex'>
          <Tab.Group onChange={(index) => {setSelectedTab(nftActivityTabs[index]);}}>
            <Tab.List className="flex rounded-3xl font-grotesk">
              {Object.keys(nftActivityTabs).map((chartType) => (
                <Tab
                  key={chartType}
                  className={({ selected }) =>
                    tw(
                      'rounded-3xl py-2.5 px-8 text-sm font-medium leading-5 text-[#6F6F6F]',
                      selected && 'bg-black text-[#F8F8F8]'
                    )
                  }
                >
                  {nftActivityTabs[chartType]}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        {selectedTab === 'Sales' &&
        <Tab.Group
          defaultIndex={6}
          onChange={(index) => {
            setSelectedTimeFrame(timeFrames[index]);
          }}
        >
          <Tab.List className="flex w-[250px] items-center order-last rounded-lg p-2">
            {Object.keys(timeFrames).map((timeFrame) => (
              <Tab
                key={timeFrame}
                className={({ selected }) =>
                  tw(
                    'font-grotesk w-full rounded-lg p-1 text-xs font-semibold leading-5 text-[#6F6F6F] ',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-gray-200 shadow text-[#1F2127] font-black cursor-default'
                      : 'hover:bg-black/[0.12] hover:text-black'
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
      {selectedTab === 'Activity' && <DynamicNFTActivity data={data} />}
      {nftData?.length > 0 && selectedTab === 'Sales' &&
        <LineVis
          label={'Sales'}
          showMarketplaceOptions={false}
          data={nftData}
          selectedTimeFrame={selectedTimeFrame}
        />}
      {selectedTab === 'Sales' && nftData?.length === 0 && <div className="my-14 font-grotesk mx-auto text-center">No data yet</div>}
    </div>
  );
};
