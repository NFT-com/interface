import { LineVis } from 'components/modules/Analytics/LineVis';
import { NFTActivity } from 'components/modules/Analytics/NFTActivity';
import { Nft } from 'graphql/generated/types';
import { useGetSales } from 'graphql/hooks/useGetSales';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { BigNumber } from 'ethers';
import moment from 'moment';
import { useState } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

export type NFTAnalyticsContainerProps = {
  data: PartialDeep<Nft>;
}

const nftChartTypes = {
  0: 'Activity',
  1: 'Price',
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

export const NFTAnalyticsContainer = ({ data }: NFTAnalyticsContainerProps) => {
  const [selectedChartType, setSelectedChartType] = useState(nftChartTypes[0]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[6]);
  const { getSales } = useGetSales();
  
  const { data: nftData } = useSWR('getSales' + data?.contract + selectedTimeFrame, async () => {
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
      return { date: moment(i.date).format('MM-DD-YYYY').toString(), value: i.price ?? i.priceUSD };
    });
    return sales;
  });

  return (
    <div className="bg-transparent overflow-x-auto p-4 minxl:p-10 minxl:pt-10 minxl:pb-0 minxl:-mb-10 w-full">
      <div className="w-full flex flex-col">
        <div className='justify-start flex'>
          <Tab.Group onChange={(index) => {setSelectedChartType(nftChartTypes[index]);}}>
            <Tab.List className="flex rounded-3xl font-grotesk">
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
        {selectedChartType === 'Price' &&
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
      {selectedChartType === 'Activity' && <NFTActivity data={data} />}
      {selectedChartType === 'Price' &&
        <LineVis
          label={'Price'}
          showMarketplaceOptions={false}
          data={nftData}
        />
      }
    </div>
  );
};