import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CollectionInfo } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface CollectionDataLeaderBoard {
  data: any;
}
export function useCollectionQueryLeaderBoard(dateRange: string): CollectionDataLeaderBoard {
  const sdk = useGraphQLSDK();
  const keyString = dateRange;
  const { data } = useSWR(keyString, async () => {
    const result = await sdk.CollectionLeaderBoard({
      input: {
        dateRange: dateRange,
      },
    });
    return result?.collectionLeaderboard ?? {};
  });
  return {
    data: data,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
