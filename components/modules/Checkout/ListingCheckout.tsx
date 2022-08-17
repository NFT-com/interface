import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext, StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ListingCheckoutNft } from './ListingCheckoutNft';

import { BigNumber } from 'ethers';
import { useCallback, useContext } from 'react';

export function ListingCheckout() {
  const {
    toList,
    setDuration,
    toggleTargetMarketplace,
    toggleCartSidebar
  } = useContext(NFTListingsContext);
    
  const openseaFullyEnabled = toList.find(listing => listing.targets?.includes('seaport')) != null;
  const looksrareFullyEnabled = toList.find(listing => listing.targets?.includes('looksrare')) != null;
    
  const allListingsConfigured = useCallback(() => {
    const unconfigured = toList.find((listing: StagedListing) => {
      return listing.startingPrice == null || BigNumber.from(listing.startingPrice).eq(0) ||
            listing.nft == null ||
            listing.duration == null ||
            isNullOrEmpty(listing.currency) ||
            isNullOrEmpty(listing.targets);
    });
    return unconfigured == null;
  }, [toList]);

  return (
    <>
      <div className='w-full flex flex-col px-8 mt-8 items-center'>
        <p className='text-lg'>Select Marketplace</p>
        <div className='flex flex-row items-center justify-around mt-4 w-full max-w-lg'>
          <div
            onClick={() => {
              toggleTargetMarketplace('seaport');
            }}
            className={tw(
              'border-2 border-opensea-blue rounded-xl',
              'p-2 cursor-pointer',
              openseaFullyEnabled ? 'bg-opensea-blue text-white' : ''
            )}
          >
                Opensea
          </div>
          <div
            onClick={() => {
              toggleTargetMarketplace('looksrare');
            }}
            className={tw(
              'border-2 border-looksrare-green rounded-xl',
              'p-2 cursor-pointer',
              looksrareFullyEnabled ? 'bg-looksrare-green text-white' : ''
            )}
          >
                Looksrare
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col px-8 mt-8 items-center'>
        <p className='text-lg'>Select Duration</p>
        <div className='flex flex-row items-center justify-around mt-4 w-full max-w-lg'>
          {
            ['1 Hour', '1 Day', '7 Days', '6 Months'].map(duration => {
              return <div
                key={duration}
                onClick={() => {
                  setDuration(duration as SaleDuration);
                }}
                className={tw(
                  'rounded-xl py-2 px-4',
                  toList?.find(l => l.duration === convertDurationToSec(duration as SaleDuration)) ? 'bg-black dark:bg-white dark:text-black' : 'bg-pill-border',
                  'text-white cursor-pointer hover:opacity-80',
                )}
              >
                {duration}
              </div>;
            })
          }
        </div>
      </div>
      <div className='mt-8 border-t border-black dark:border-white w-full'>
        {filterNulls(toList).map((listing, index) => {
          return <ListingCheckoutNft key={index} listing={listing} />;
        })}
      </div>
      {
        isNullOrEmpty(toList) && <div className='flex flex-col items-center justify-center my-12'>
          No NFTs staged for listing
        </div>
      }
      <Button
        disabled={!allListingsConfigured()}
        label={'Proceed to List'}
        onClick={() => {
          toggleCartSidebar();
        }}
        type={ButtonType.PRIMARY} />
    </>
  );
}