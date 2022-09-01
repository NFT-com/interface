import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { ExternalProtocol } from 'types';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { convertDurationToSec, SaleDuration } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ListingCheckoutNftTableRow } from './ListingCheckoutNftTableRow';
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

  const openseaFullyEnabled = toList.find(listing => listing.targets?.includes(ExternalProtocol.Seaport)) != null;
  const looksrareFullyEnabled = toList.find(listing => listing.targets?.includes(ExternalProtocol.LooksRare)) != null;

  return (
    <div className="flex flex-col minlg:flex-row w-full mt-10">
      <div className="flex flex-col items-center w-full">
        <div className='w-full flex flex-col px-8 items-center'>
          <span className='text-2xl w-full flex font-bold'>Select Marketplace</span>
          <div className='flex flex-col items-center justify-around w-full max-w-lg'>
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.Seaport);
                setShowSummary(false);
              }}
              className={tw(
                'border border-[#D5D5D5] rounded-xl text-lg',
                'px-4 py-6 cursor-pointer w-full mt-4',
                openseaFullyEnabled ? 'border-2 border-primary-yellow font-bold' : ''
              )}
            >
            Opensea
            </div>
            <div
              onClick={() => {
                toggleTargetMarketplace(ExternalProtocol.LooksRare);
                setShowSummary(false);
              }}
              className={tw(
                'border border-[#D5D5D5] rounded-xl text-lg',
                'px-4 py-6 cursor-pointer w-full mt-4',
                looksrareFullyEnabled ? 'border-2 border-primary-yellow font-bold' : ''
              )}
            >
            Looksrare
            </div>
          </div>
        </div>
        <div className='w-full flex flex-col px-8 mt-8 items-center'>
          <span className='text-2xl w-full flex font-bold'>Set Duration</span>
          <div className='flex flex-row items-center justify-around mt-4 w-full max-w-lg'>
            {
              ['1 Hour', '1 Day', '7 Days', '6 Months', '1 Year'].map(duration => {
                return <div
                  key={duration}
                  onClick={() => {
                    setDuration(duration as SaleDuration);
                  }}
                  className={tw(
                    'rounded-full py-2.5 px-2',
                    toList?.find(l => l.duration === convertDurationToSec(duration as SaleDuration)) ? 'bg-black font-bold text-white' : 'border border-[#D5D5D5] text-black',
                    'cursor-pointer hover:opacity-80',
                  )}
                >
                  {duration}
                </div>;
              })
            }
          </div>
        </div>
        <div className='my-8 w-full'>
          <div className="border-t border-[#D5D5D5] mx-8">
            <span className='text-2xl w-full flex font-bold mt-10 mb-8'>Your Listings</span>
          </div>
          <table className="w-full mx-8 text-sm overflow-x-scroll table-auto">
            <thead>
              <tr>
                <th className="font-medium pb-3 text-blog-text-reskin text-left">NFT</th>
                <th className="font-medium pb-3 text-blog-text-reskin text-left">Set Price</th>
                <th className="font-medium pb-3 text-blog-text-reskin text-left">Marketplaces</th>
              </tr>
            </thead>
            <tbody>
              {filterNulls(toList).map((listing, index) => {
                return <ListingCheckoutNftTableRow key={index} listing={listing} onPriceChange={() => {
                  setShowSummary(false);
                }} />;
              })}
            </tbody>
          </table>
        </div>
        {
          isNullOrEmpty(toList) && <div className='flex flex-col items-center justify-center my-12'>
          No NFTs staged for listing
          </div>
        }
        {!showSummary && toList.length > 0 && <Button
          label={'Start Listing'}
          onClick={async () => {
            await prepareListings();
            setShowSummary(true);
          }}
          type={ButtonType.PRIMARY}
        />}
      </div>
      <div className='flex flex-col p-8 w-full'>
        {showSummary && toList.length > 0 &&
        <NFTListingsCartSummary />
        }
      </div>
    </div>
  );
}