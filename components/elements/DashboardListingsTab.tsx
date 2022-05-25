import { DropdownPicker } from 'components/elements/DropdownPicker';
import { MarketplaceMultiAssetCard } from 'components/elements/MarketplaceMultiAssetCard';
import { MarketAsk } from 'graphql/generated/types';
import { useGetAsks } from 'graphql/hooks/useGetAsks';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import { isNFT } from 'utils/marketplaceUtils';

import { DashboardTabTitle } from './DashboardTabTitle';

import { ethers } from 'ethers';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export function DashboardListingsTab() {
  const { data: account } = useAccount();
  const { data: userCreatedAsks } = useGetAsks(account?.address);
  const router = useRouter();
  const { setWalletSlideOpen } = useWalletSlide();

  const [selectedListings, setSelectedListings] = useState<PartialDeep<MarketAsk>[]>([]);
  const [sortBy, setSortBy] = useState(0);
  const [itemTypes, setItemTypes] = useState(0);

  const isListing = (marketAsk: PartialDeep<MarketAsk>) => {
    // To be considered a "Listing", there must be one makeAsset and it must be an NFT.
    return marketAsk.makeAsset.length === 1 || isNFT(marketAsk.makeAsset[0].standard.assetClass);
  };

  const listings = userCreatedAsks?.items?.filter(isListing) ?? [];

  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <div className='w-full flex flex-row mt-8'>
        <div className='w-1/2'>
          <DashboardTabTitle title="My Listings" />
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
      <div className="pt-10 flex flex-wrap justify-around">
        {listings.map((listing) => {
          const expiration = moment(listing.end * 1000);
          const expirationLabel = 'Expires: ' +
            (expiration.isBefore(moment.utc()) ? 'Never' : expiration.fromNow());
          return <div
            key={listing?.id}
            className="flex w-1/5 mx-1 shrink-0 deprecated_sm:w-full deprecated_sm:px-8 deprecated_sm:mb-2"
          >
            <MarketplaceMultiAssetCard
              assets={listing.makeAsset}
              subtitle={expirationLabel}
              onSelectToggle={(selected: boolean) => {
                if (selected) {
                  setSelectedListings([...selectedListings, listing]);
                } else {
                  setSelectedListings(
                    selectedListings.filter((included) => included.id === listing.id));
                }
              }}
              onClick={() => {
                setWalletSlideOpen(false);
                router.push(
                  '/app/nft/' +
                    ethers.utils.getAddress(listing?.makeAsset[0]?.standard?.contractAddress) +
                    '/' +
                    listing?.makeAsset[0]?.standard?.tokenId
                );
              }}
            />
          </div>;
        })}
      </div>
    </div>
  );
}