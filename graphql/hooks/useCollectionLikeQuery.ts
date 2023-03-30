import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useNonProfileModal } from 'hooks/state/useNonProfileModal';

import useSWR, { mutate } from 'swr';

export interface CollectionLikeCountData {
  data: { __typename?: 'CollectionInfo'; collection?: { __typename?: 'Collection'; likeCount?: number; isLikedByUser?: boolean; }; }
  loading: boolean;
  mutate: () => void;
}

export function useCollectionLikeCountQuery(chainId: string, contract: string): CollectionLikeCountData {
  const sdk = useGraphQLSDK();
  const { likeId } = useNonProfileModal();

  const keyString = 'CollectionLikeQuery' + contract + chainId + likeId;

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
