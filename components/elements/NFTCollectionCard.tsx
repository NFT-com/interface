import { useCollectionQuery } from 'graphql/hooks/useCollectionQuery';

import { NFTCard } from './NFTCard';

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
  const { data: collection } = useCollectionQuery(props.contract);
  const processedImages = props.images.filter(i => i != null);
  return (
    <NFTCard
      title={collection?.name}
      traits={[{ key: '', value: props.count + (props.count > 1 ? ' items' : ' item') }]}
      images={processedImages}
      imageLayout="row"
      onClick={props.onClick}
    />
  );
}