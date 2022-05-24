import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Collection } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';

export interface CollectionData {
  data: Collection;
  loading: boolean;
  mutate: () => void;
}

export function useCollectionQuery(contract: string): CollectionData {
  const sdk = useGraphQLSDK();
  const keyString = 'CollectionQuery ' + contract;

  const { data } = useSWR(keyString, async () => {
    const result = await sdk.Collection({
      input: {
        contract
      },
    });
    return result?.collection;
  });
  return {
    data: data,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
