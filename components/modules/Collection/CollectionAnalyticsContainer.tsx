import { LineChart } from 'components/modules/Analytics/LineChart';
import { CollectionInfo } from 'graphql/generated/types';
import { useGetCollectionSalesHistory } from 'hooks/analytics/aggregation/useGetCollectionSalesHistory';
import { useGetCollectionByAddress } from 'hooks/analytics/graph/useGetCollectionByAddress';
import { getDateFromTimeFrame } from 'utils/helpers';

import { useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';

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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);

  const collectionId = useGetCollectionByAddress(data?.collection?.contract);
  
  const currentDate = useMemo(() => {
    return new Date();
  }, []);

  const dateFromTimeFrame = useMemo(() => {
    return getDateFromTimeFrame(currentDate, selectedTimeFrame);
  }, [currentDate, selectedTimeFrame]);

  const collectionSalesHistory = useGetCollectionSalesHistory(collectionId, dateFromTimeFrame, currentDate);

  return (
    <div className="bg-transparent">
      <LineChart
        data={data}
        currentMarketplace={selectedMarketplace}
        setCurrentMarketplace={(selectedMarketplace: string) => {
          setSelectedMarketplace(selectedMarketplace);
        }}
        setCurrentTimeFrame={(selectedTimeFrame: string) => {
          setSelectedTimeFrame(selectedTimeFrame);
        }}
      />
    </div>
  );
};