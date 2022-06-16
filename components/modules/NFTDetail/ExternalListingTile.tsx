import { Button, ButtonType } from 'components/elements/Button';
import { ExternalListing, SupportedExternalExchange } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export interface ExternalListingTileProps {
  listing: PartialDeep<ExternalListing>;
}

const Colors = {
  [SupportedExternalExchange.Looksrare]: 'bg-looksrare-green',
  [SupportedExternalExchange.Opensea]: 'bg-opensea-blue',
  [SupportedExternalExchange.X2y2]: 'bg-x2y2-orange',
  [SupportedExternalExchange.Rarible]: 'bg-rarible-red',
};

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listing } = props;

  return <div className="flex flex-col bg-white dark:bg-detail-bg-dk rounded-xl p-5 my-6">
    <div className='flex items-center mb-4'>
      <div className={tw(
        'aspect-square h-8 w-8 rounded-full',
        Colors[listing.exchange]
      )}>
        {/* todo: put <Image> here  */}
      </div>
      <div className="flex flex-col text-primary-txt dark:text-primary-txt-dk ml-3">
        <span className='text-sm'>
            Listed on <span className='text-link'>{listing.exchange}</span>
        </span>
        <div className='flex items-center'>
          <span className='text-base font-medium'>
            {ethers.utils.formatEther(listing?.price ?? listing?.highestOffer ?? 0)}{listing?.currency ?? 'ETH'}
          </span>
        </div>
      </div>
    </div>
    <Button
      stretch
      color="white"
      label={'View Listing'}
      onClick={() => {
        window.open(listing?.url, '_blank');
      }}
      type={ButtonType.PRIMARY}
    />
  </div>;
}