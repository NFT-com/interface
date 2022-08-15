import { NFTCard } from 'components/elements/NFTCard';
import { Collection } from 'graphql/generated/types';
import { AlchemyNFTMetaDataResponse } from 'types/alchemy';
import { getNftsForCollection } from 'utils/alchemyNFT';
import { filterNulls, processIPFSURL } from 'utils/helpers';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

export interface DeployedCollectionCardProps {
  collection: PartialDeep<Collection>;
}

export function DeployedCollectionCard(props: DeployedCollectionCardProps) {
  const router = useRouter();

  const { data } = useSWR('DeployedCollectionCard' + props.collection?.contract, async () => {
    const response = await getNftsForCollection(props.collection.contract, 3);
    return response?.['nfts'] as PartialDeep<AlchemyNFTMetaDataResponse>[];
  });

  return <NFTCard
    title={props.collection?.name}
    imageLayout="row"
    images={
      filterNulls(data ?? [])
        .map((nft: PartialDeep<AlchemyNFTMetaDataResponse>) => nft?.metadata?.image)
        .map(processIPFSURL)
    }
    onClick={() => {
      router.push(`/app/collection/${props.collection?.contract}`);
    }}
    contractAddress={props.collection?.contract}
  />;
}