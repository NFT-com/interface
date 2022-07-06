import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CollectionInfo } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface CollectionData {
  data: PartialDeep<CollectionInfo>;
  loading: boolean;
  mutate: () => void;
}

export function useCollectionQuery(chainId: string, contract: string, withOpensea: boolean): CollectionData {
  const sdk = useGraphQLSDK();
  const keyString = 'CollectionQuery ' + contract + chainId + withOpensea;

  const { data } = useSWR(keyString, async () => {
    if(!chainId || !contract) {
      return {};
    }
    const result = await sdk.Collection({
      input: {
        chainId,
        contract,
        network: 'ethereum',
        withOpensea
      },
    });
    return result?.collection ?? {};
  });
  return {
    data: data,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
