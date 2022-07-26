import { DropdownPicker } from 'components/elements/DropdownPicker';
import { MarketplaceMultiAssetCard } from 'components/elements/MarketplaceMultiAssetCard';
import { MarketAsk } from 'graphql/generated/types';
import { useGetAsks } from 'graphql/hooks/useGetAsks';
import { isNFT } from 'utils/marketplaceUtils';

import { DashboardTabTitle } from './DashboardTabTitle';

import moment from 'moment';
import { useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export function DashboardOffersTab() {
  const { address: currentAddress } = useAccount();
  const { data: userCreatedAsks } = useGetAsks(currentAddress);

  const [selectedOffers, setSelectedOffers] = useState<PartialDeep<MarketAsk>[]>([]);
  const [sortBy, setSortBy] = useState(0);
  const [itemTypes, setItemTypes] = useState(0);
  
  const isOffer = (marketAsk: PartialDeep<MarketAsk>) => {
    // To be considered an "Offer", the marketAsk must either accept a basket of assets 
    // (which is impossible to do with a "Listing"), or it must accept a single NFT (also impossible
    // to do with a listing)
    return marketAsk.takeAsset.length > 1 || isNFT(marketAsk.takeAsset[0].standard.assetClass);
  };

  const offers = userCreatedAsks?.items?.filter(isOffer) ?? [];

  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <div className='w-full flex flex-row mt-8'>
        <div className='w-1/2'>
          <DashboardTabTitle title="My Offers" />
        </div>
        <div className='w-1/2 flex flex-row-reverse space-x-4 space-x-reverse deprecated_sm:hidden'>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'All Items'}
              selectedIndex={itemTypes}
              options={[
                {
                  label: 'NFTs',
                  onSelect: () => setItemTypes(0),
                },
                {
                  label: 'Domains',
                  onSelect: () => setItemTypes(1)
                }
              ]}/>
          </div>
          <div className='w-1/4'>
            <DropdownPicker
              placeholder={'Sort By'}
              selectedIndex={sortBy}
              options={[
                {
                  label: 'Price',
                  onSelect: () => setSortBy(0),
                },
                {
                  label: 'Rarity',
                  onSelect: () => setSortBy(1),
                },
                {
                  label: 'Recently Acquired',
                  onSelect: () => setSortBy(2),
                },
                {
                  label: 'Collection Type',
                  onSelect: () => setSortBy(3),
                },
              ]}/>
          </div>
        </div>
      </div>
      <div className='pt-10 flex flex-wrap justify-around'>
        {(offers ?? [])?.map((offer) => {
          const expiration = moment(offer.end * 1000);
          const expirationLabel = 'Expires: ' +
            (expiration.isBefore(moment.utc()) ? 'Never' : expiration.fromNow());
          return <div
            key={offer?.id}
            className="flex w-1/5 mx-1 shrink-0 deprecated_sm:w-full deprecated_sm:px-8 deprecated_sm:mb-2"
          >
            <MarketplaceMultiAssetCard
              assets={offer.makeAsset}
              subtitle={expirationLabel}
              onSelectToggle={(selected: boolean) => {
                if (selected) {
                  setSelectedOffers([...selectedOffers, offer]);
                } else {
                  setSelectedOffers(selectedOffers.filter((included) => included.id === offer.id));
                }
              }}
              onClick={() => null} // todo: navigate to the nft if it's an offer for an NFT?
            />
          </div>;
        })}
      </div>
    </div>
  );
}