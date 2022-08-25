import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { SupportedExternalProtocol } from 'graphql/generated/types';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ListingCheckoutNft } from './ListingCheckoutNft';
import { NFTListingsCartSummary } from './NFTListingsCartSummary';

import { useContext, useState } from 'react';

export function ListingCheckout() {
  const {
    toList,
    setDuration,
    toggleTargetMarketplace,
    prepareListings
  } = useContext(NFTListingsContext);
    
  const [showSummary, setShowSummary] = useState(false);

  const openseaFullyEnabled = toList.find(listing => listing.targets?.includes(SupportedExternalProtocol.Seaport)) != null;
  const looksrareFullyEnabled = toList.find(listing => listing.targets?.includes(SupportedExternalProtocol.LooksRare)) != null;

  return (
    <div className="flex flex-col minlg:flex-row w-full">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col px-8 mt-8 items-center'>
          <p className='text-lg'>Select Marketplace</p>
          <div className='flex flex-row items-center justify-around mt-4 w-full max-w-lg'>
            <div
              onClick={() => {
                toggleTargetMarketplace(SupportedExternalProtocol.Seaport);
                setShowSummary(false);
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
                toggleTargetMarketplace(SupportedExternalProtocol.LooksRare);
                setShowSummary(false);
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
        <div className='my-8 border-t border-black dark:border-white w-full'>
          {filterNulls(toList).map((listing, index) => {
            return <ListingCheckoutNft key={index} listing={listing} onPriceChange={() => {
              setShowSummary(false);
            }} />;
          })}
        </div>
        {
          isNullOrEmpty(toList) && <div className='flex flex-col items-center justify-center my-12'>
          No NFTs staged for listing
          </div>
        }
        {!showSummary && <Button
          label={'Next'}
          onClick={async () => {
            await prepareListings();
            setShowSummary(true);
          }}
          type={ButtonType.PRIMARY}
        />}
      </div>
      <div className='flex flex-col p-8 w-full'>
        {showSummary &&
        <>
          <p className="text-xl font-bold">
          Summary and fees for {toList?.length ?? 0} NFTs
          </p>
          <NFTListingsCartSummary />
        </>}
      </div>
    </div>
  );
}