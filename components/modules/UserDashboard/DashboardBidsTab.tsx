import { DropdownPicker } from 'components/elements/DropdownPicker';
import { MarketplaceMultiAssetCard } from 'components/elements/MarketplaceMultiAssetCard';
import { MarketBid } from 'graphql/generated/types';
import { useGetBids } from 'graphql/hooks/useGetBids';

import { DashboardTabTitle } from './DashboardTabTitle';

import moment from 'moment';
import { useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export function DashboardBidsTab() {
  const { address: currentAddress } = useAccount();
  const { data: bidsForUser } = useGetBids(undefined, currentAddress);

  const [selectedBids, setSelectedBids] = useState<PartialDeep<MarketBid>[]>([]);
  const [sortBy, setSortBy] = useState(0);

  const isBid = (marketBid: PartialDeep<MarketBid>) => {
    return marketBid.makeAsset.length === 1;
  };

  const bids = bidsForUser?.items?.filter(isBid) ?? [];

  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <div className='w-full flex flex-row mt-8'>
        <div className='w-1/2'>
          <DashboardTabTitle title='My Bids' />
        </div>
        <div className='w-1/2 flex flex-row-reverse space-x-4 space-x-reverse deprecated_sm:hidden'>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'Sort By'}
              selectedIndex={sortBy}
              options={[
                {
                  label: 'Date',
                  onSelect: () => setSortBy(0),
                },
                {
                  label: 'Auction Type',
                  onSelect: () => setSortBy(1)
                },
                {
                  label: 'Status',
                  onSelect: () => setSortBy(2)
                }
              ]}/>
          </div>
        </div>
      </div>  <div className='pt-10 flex flex-wrap justify-around'>
        {(bids ?? [])?.map((bid) => {
          const expiration = moment(bid.end * 1000);
          const expirationLabel = `Expires: ${(expiration.isBefore(moment.utc()) ? 'Never' : expiration.fromNow())}`;

          return <div key={bid?.id} className='flex w-1/5 mx-1 shrink-0 deprecated_sm:w-full deprecated_sm:px-8 deprecated_sm:mb-2'>
            <MarketplaceMultiAssetCard
              assets={bid.makeAsset}
              subtitle={expirationLabel}
              onSelectToggle={(selected: boolean) => {
                if (selected) {
                  setSelectedBids([...selectedBids, bid]);
                } else {
                  setSelectedBids(selectedBids.filter((included) => included.id === bid.id));
                }
              }}
              onClick={() => null} // todo: navigate to the nft if it's a bid for an NFT?
            />
          </div>;
        })}
      </div>
    </div>
  );
}