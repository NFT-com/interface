import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ActivityStatus, ActivityType, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback } from 'react';
import { mutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartialDeep } from 'type-fest';

export interface SaleActivitiesData {
  data: Array<PartialDeep<TxActivity>>;
  loading: boolean;
  mutate: () => void;
}

export function useSaleActivitiesQuery(address: string, chainId: string): SaleActivitiesData {
  const sdk = useGraphQLSDK();
  const keyString = 'SaleActivitiesQuery ' +
    chainId +
    address;
    
  const { data } = useSWRImmutable(keyString, async () => {
    if (isNullOrEmpty(address) || isNullOrEmpty(chainId)) {
      return [];
    }
    const result = await sdk.Activities({
      input: {
        pageInput: {
          first: 50,
        },
        walletAddress: address,
        activityType: ActivityType.Sale,
        chainId,
        status: ActivityStatus.Valid,
        read: false
      }
    });
    return result?.getActivities?.items;
  });

  const mutateActivities = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  return {
    data: data ?? [],
    loading: data == null,
    mutate: mutateActivities,
  };
}
