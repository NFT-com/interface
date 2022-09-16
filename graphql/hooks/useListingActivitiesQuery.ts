import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ActivityExpiration, ActivityStatus, ActivityType, Maybe, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback } from 'react';
import { mutate } from 'swr';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

export interface ListingActivitiesData {
  data: Array<PartialDeep<TxActivity>>;
  loading: boolean;
  mutate: () => void;
}

export function useListingActivitiesQuery(contract: string, tokenId: string, chainId: string, owner: Maybe<string>): ListingActivitiesData {
  const sdk = useGraphQLSDK();
  const keyString = 'ListingActivitiesQuery ' +
    chainId +
    contract +
    tokenId +
    owner;
    
  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(tokenId) || isNullOrEmpty(chainId) || isNullOrEmpty(owner)) {
      return [];
    }
    const result = await sdk.Activities({
      input: {
        // todo: paginate to get all the listings
        pageInput: {
          first: 50,
        },
        activityType: ActivityType.Listing,
        chainId,
        contract,
        tokenId,
        status: ActivityStatus.Valid,
        expirationType: ActivityExpiration.Active,
        walletAddress: owner
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
