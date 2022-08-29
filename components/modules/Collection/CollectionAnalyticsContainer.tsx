import { BarGraph } from 'components/modules/Analytics/BarGraph';
import { LineChart } from 'components/modules/Analytics/LineChart';
import { CollectionInfo } from 'graphql/generated/types';
import { useGetCollectionSalesHistory } from 'hooks/analytics/aggregation/useGetCollectionSalesHistory';
import { useGetCollectionByAddress } from 'hooks/analytics/graph/useGetCollectionByAddress';
import { getDateFromTimeFrame } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export type CollectionAnalyticsContainerProps = {
  data: PartialDeep<CollectionInfo>;
}

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

export const CollectionAnalyticsContainer = ({ data }: CollectionAnalyticsContainerProps) => {
  const { chain } = useNetwork();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);

  const [collectionLineData, setCollectionLineData] = useState(null);
  const [collectionBarData, setCollectionBarData] = useState(null);

  const dateFrom = useMemo(() => {
    return getDateFromTimeFrame(selectedTimeFrame);
  }, [selectedTimeFrame]);

  const collectionId = useGetCollectionByAddress(data?.collection?.contract);
  const collectionSalesHistory = useGetCollectionSalesHistory(collectionId, dateFrom);

  useEffect(() => {
    if(chain.id !== 1) {
      setCollectionLineData(null);
      setCollectionBarData(null);
      return;
    } else {
      setCollectionLineData(collectionSalesHistory);
      setCollectionBarData(collectionSalesHistory);
    }
  }, [chain.id, collectionSalesHistory]);

  return (
    <>
      <div className="bg-transparent">
        {(collectionLineData && collectionBarData) &&
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
        }
        <LineChart
          label={'Floor Price'}
          showMarketplaceOptions={false}
          data={collectionLineData}
          currentMarketplace={selectedMarketplace}
          setCurrentMarketplace={(selectedMarketplace: string) => {
            setSelectedMarketplace(selectedMarketplace);
          }}
        />
      </div>
      <div className='bg-transparent'>
        <BarGraph
          label={'Volume'}
          data={collectionBarData}
          currentMarketplace={selectedMarketplace}
        />
      </div>
    </>
  );
};