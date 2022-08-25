import { LineChart } from 'components/modules/Analytics/LineChart';
import { TxHistory } from 'components/modules/Analytics/TxHistory';
import { Nft } from 'graphql/generated/types';
import { useGetNftPriceHistory } from 'hooks/analytics/aggregation/useGetNftPriceHistory';
import { useGetNftByTokenId } from 'hooks/analytics/graph/useGetNftByTokenId';
import { getDateFromTimeFrame } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type NFTAnalyticsContainerProps = {
  data: PartialDeep<Nft>;
}

const nftChartTypes = {
  0: 'Price',
  1: 'Bids',
  2: 'Activity'
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
  5: 'ALL',
};

export const NFTAnalyticsContainer = ({ data }: NFTAnalyticsContainerProps) => {
  const [selectedChartType, setSelectedChartType] = useState(nftChartTypes[0]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrames[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);

  const currentDate = useMemo(() => {
    return new Date();
  }, []);

  const dateFromTimeFrame = useMemo(() => {
    return getDateFromTimeFrame(selectedTimeFrame);
  }, [selectedTimeFrame]);

  const nftId = useGetNftByTokenId(data?.contract, parseInt(data?.tokenId, 16).toString())?.nft_by_token_id?.id;
  const nftPriceHistory = useGetNftPriceHistory(nftId, dateFromTimeFrame, currentDate);
  console.log(nftPriceHistory);

  return (
    <div className="bg-transparent">
      <div className="w-full">
        <Tab.Group onChange={(index) => {setSelectedChartType(nftChartTypes[index]); setSelectedTimeFrame(timeFrames[0]);}}>
          <Tab.List className="flex space-x-1 rounded-3xl bg-[#F6F6F6] font-grotesk">
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
      {selectedChartType === 'Activity'
        ? <TxHistory />
        : <LineChart
          data={data}
          currentMarketplace={selectedMarketplace}
          setCurrentMarketplace={(selectedMarketplace: string) => {
            setSelectedMarketplace(selectedMarketplace);
          }}
          setCurrentTimeFrame={(selectedTimeFrame: string) => {
            setSelectedTimeFrame(selectedTimeFrame);
          }}
        /> }
    </div>
  );
};