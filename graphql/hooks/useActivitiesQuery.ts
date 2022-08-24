import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { TxActivitiesInput, TxActivity } from 'graphql/generated/types';

import { mutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartialDeep } from 'type-fest';

export interface ActivitiesData {
  data: Array<PartialDeep<TxActivity>>;
  loading: boolean;
  mutate: () => void;
}

export function useActivitiesQuery(input: TxActivitiesInput): ActivitiesData {
  const sdk = useGraphQLSDK();
  const keyString = 'ActivitiesQuery ' +
    input?.chainId +
    input?.contract +
    input?.tokenId +
    input?.activityType +
    input?.skipRelations +
    input?.walletAddress;

  const { data } = useSWRImmutable(keyString, async () => {
    if (input == null) {
      return [];
    }
    const result = await sdk.Activities({
      input
    });
    return result?.getActivities?.items;
  });
  return {
    data: data ?? [],
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
