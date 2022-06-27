import { ProfileEditContext } from 'components/modules/Profile/ProfileEditContext';
import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';

import { NFTCard } from './NFTCard';

import { useContext } from 'react';
import { useNetwork } from 'wagmi';

export interface NFTCollectionCardProps {
  contract: string
  count: number
  images: string[]
  onClick: () => void
}

/**
 * Simple wrapper to an NFT card that will fetch collection data for you.
 */
export function NFTCollectionCard(props: NFTCollectionCardProps) {
  const { activeChain } = useNetwork();

  const {
    draftNftsDescriptionsVisible
  } = useContext(ProfileEditContext);

  const { data: collection } = useCollectionQuery(String(activeChain?.id), props?.contract, '');
  const processedImages = props.images.filter(i => i != null);

  return (
    <NFTCard
      title={collection?.collection?.name}
      traits={[{ key: '', value: props.count + (props.count > 1 ? ' items' : ' item') }]}
      images={processedImages}
      imageLayout="row"
      onClick={props.onClick}
      nftsDescriptionsVisible={draftNftsDescriptionsVisible}
      contractAddress={collection?.collection?.contract}
    />
  );
}