import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ActivityStatus, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { mutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartialDeep } from 'type-fest';

export interface ActivitiesForAddressData {
  data: {
    items: Array<PartialDeep<TxActivity>>;
    totalItems: number;
    pageInfo: {
      firstCursor: string;
      lastCursor: string;
    }
  } | any
  loading: boolean;
  mutate: () => void;
}

export function useActivitiesForAddressQuery(address: string, chainId: string, first?: number): ActivitiesForAddressData {
  const sdk = useGraphQLSDK();
  const keyString = 'ActivitiesForAddressQuery ' +
    chainId +
    address;
    
  const { data } = useSWRImmutable(keyString, async () => {
    if (isNullOrEmpty(address) || isNullOrEmpty(chainId)) {
      return [];
    }
    const result = await sdk.Activities({
      input: {
        // todo: paginate to get all the listings
        pageInput: {
          first,
        },
        chainId,
        walletAddress: address,
        includeExpired: true,
        status: ActivityStatus.Valid
      }
    });
    return result?.getActivities;
  });
  return {
    data: data ?? [],
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
