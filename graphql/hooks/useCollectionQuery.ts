import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CollectionInfo } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';

export interface CollectionData {
  data: CollectionInfo;
  loading: boolean;
  mutate: () => void;
}

export function useCollectionQuery(chainId: string, contract: string, network: string): CollectionData {
  const sdk = useGraphQLSDK();
  const keyString = 'CollectionQuery ' + contract;

  const { data } = useSWR(keyString, async () => {
    if(!chainId || !contract) {
      return null;
    }
    const result = await sdk.Collection({
      input: {
        chainId,
        contract,
        network
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
