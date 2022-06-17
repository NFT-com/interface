import { Nft } from 'graphql/generated/types';
import { useExternalListingsQuery } from 'graphql/hooks/useExternalListingsQuery';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ExternalListingTile } from './ExternalListingTile';

import { PartialDeep } from 'type-fest';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { data: listings } = useExternalListingsQuery(props.nft?.contract, props.nft?.tokenId, props.nft?.wallet.chainId);
  return <div className={tw(
    'flex w-full px-4',
    'md:flex-col flex-row flex-wrap'
  )}>
    {listings?.filter((l) => !isNullOrEmpty(l.url))?.map((listing, index) => (
      <div className='md:w-full w-2/4 pr-2' key={index}>
        <ExternalListingTile listing={listing} />
      </div>
    ))}
  </div>;
}