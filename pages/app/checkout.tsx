import { Button, ButtonType } from 'components/elements/Button';
import { PriceInput } from 'components/elements/PriceInput';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { NFTListingsContext, StagedListing } from 'components/modules/NFTDetail/NFTListingsContext';
import NotFoundPage from 'pages/404';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { filterNulls, isNullOrEmpty, processIPFSURL } from 'utils/helpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useContext } from 'react';

/**
 * Renders the entire cart (both listing and buying),
 * with configuration options for the listing side.
 */
export default function CheckoutPage() {
  const {
    listAll,
    toList,
    setDuration,
    toggleTargetMarketplace,
    setPrice
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

  if (!getEnv(Doppler.NEXT_PUBLIC_ROUTER_ENABLED)) {
    return <NotFoundPage />;
  }

  return <PageWrapper>
    <div className={tw(
      'w-full h-full pt-20 flex flex-col items-center text-primary-txt dark:text-primary-txt-dk',
      getEnvBool(Doppler.NEXT_PUBLIC_FORCE_DARK_MODE) ? 'bg-white' : 'bg-white dark:bg-black'
    )}>
      <div className='max-w-xl w-full flex flex-col items-center my-8'>
        <div className='w-full flex px-8'>
          <h1 className='text-xl font-bold underline'>Configure Listings</h1>
        </div>
        <div className='w-full flex flex-col px-8 mt-8'>
          <p className='text-lg'>Select Marketplace</p>
          <div className='flex flex-row items-center justify-around mt-4 max-w-lg'>
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
        <div className='w-full flex flex-col px-8 mt-8'>
          <p className='text-lg'>Select Duration</p>
          <div className='flex flex-row items-center justify-around mt-4 max-w-lg'>
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
        <div className='mt-8 border-t border-black w-full'>
          {filterNulls(toList).map((listing, index) => {
            return <div key={index} className='flex items-center w-full h-32 px-8'>
              <div className='relative h-2/4 aspect-square'>
                <video
                  autoPlay
                  muted
                  loop
                  key={processIPFSURL(listing.nft?.metadata?.imageURL)}
                  src={processIPFSURL(listing.nft?.metadata?.imageURL)}
                  poster={processIPFSURL(listing.nft?.metadata?.imageURL)}
                  className={tw(
                    'flex object-fit w-full justify-center rounded-md',
                  )}
                />
              </div>
              <div className='flex flex-col ml-4'>
                <span>{listing?.nft?.metadata?.name}</span>
                <span>{'#' + BigNumber.from(listing?.nft?.tokenId ?? 0).toNumber()}</span>
              </div>
              <div className='flex flex-col ml-4'>
                {listing.targets?.includes('seaport') && <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
                {listing.targets?.includes('looksrare') && <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
              </div>
              <div className='flex flex-col ml-4'>
                <PriceInput
                  currency={'WETH'}
                  currencyOptions={['WETH']}
                  onPriceChange={(val: BigNumber) => {
                    setPrice(listing, val);
                  }}
                  onCurrencyChange={null}
                  error={listing?.startingPrice == null || BigNumber.from(listing?.startingPrice).eq(0)}
                />
              </div>
            </div>;
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
          onClick={listAll}
          type={ButtonType.PRIMARY} />
      </div>
    </div>
  </PageWrapper>;
}