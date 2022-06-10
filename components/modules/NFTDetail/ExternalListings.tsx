import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { ExternalListingTile } from './ExternalListingTile';

import { PartialDeep } from 'type-fest';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
}

export function ExternalListings(props: ExternalListingsProps) {
//   const listings = useExternalListingsQuery(props.nft.id);
  const listings = ['opensea', 'looksrare', 'opensea', 'looksrare'];
  return <div className={tw(
    'flex w-full px-4',
    'md:flex-col flex-row flex-wrap'
  )}>
    {listings.map((listing, index) => (
      <div className='md:w-full w-2/4 md:px-0 px-2' key={index}>
        <ExternalListingTile listingURL={''} exchange={listing} />
      </div>
    ))}
  </div>;
}