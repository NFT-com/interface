import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';

import useSWR, { mutate } from 'swr';

export interface CollectionLikeCountData {
  data: { __typename?: 'CollectionInfo'; collection?: { __typename?: 'Collection'; likeCount?: number; isLikedByUser?: boolean; }; }
  loading: boolean;
  mutate: () => void;
}

export function useCollectionLikeCountQuery(contract: string): CollectionLikeCountData {
  const sdk = useGraphQLSDK();
  const { likeId } = useNonProfileModal();
  const defaultChainId = useDefaultChainId();

  const keyString = 'CollectionLikeQuery' + contract + defaultChainId + likeId;

  const { data } = useSWR(keyString, async () => {
    if (!defaultChainId || !contract) {
      return {};
    }
    const result = await sdk.CollectionLikeCount({
      input: {
        chainId: defaultChainId,
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
