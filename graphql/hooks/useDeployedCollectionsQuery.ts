import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Collection } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface CollectionData {
  collections: PartialDeep<Collection>[];
  loading: boolean;
  mutate: () => void;
}

export function useDeployedCollectionsQuery(address: string): CollectionData {
  const sdk = useGraphQLSDK();
  const keyString = 'DeployedCollectionsQuery ' + address;

  const { data } = useSWR(keyString, async () => {
    const result = await sdk.DeployedCollections({
      deployer: address
    });
    return result?.collectionsByDeployer ?? [];
  });
  return {
    collections: data,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
