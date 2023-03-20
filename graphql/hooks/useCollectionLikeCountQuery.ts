import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CollectionInfo } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface CollectionLikeCountData {
  data: PartialDeep<CollectionInfo>;
  loading: boolean;
  mutate: () => void;
}

export function useCollectionLikeCountQuery(chainId: string, contract: string): CollectionLikeCountData {
  const sdk = useGraphQLSDK();
  const keyString = 'CollectionQuery ' + contract + chainId;

  const { data } = useSWR(keyString, async () => {
    if (!chainId || !contract) {
      return {};
    }
    const result = await sdk.CollectionLikeCount({
      input: {
        chainId,
        contract,
        network: 'ethereum',
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
