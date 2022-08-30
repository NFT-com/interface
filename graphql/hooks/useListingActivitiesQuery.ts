import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ActivityType, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { mutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartialDeep } from 'type-fest';

export interface ListingActivitiesData {
  data: Array<PartialDeep<TxActivity>>;
  loading: boolean;
  mutate: () => void;
}

export function useListingActivitiesQuery(contract: string, tokenId: string, chainId: string): ListingActivitiesData {
  const sdk = useGraphQLSDK();
  const keyString = 'ListingActivitiesQuery ' +
    chainId +
    contract +
    tokenId;
    
  const { data } = useSWRImmutable(keyString, async () => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(tokenId) || isNullOrEmpty(chainId)) {
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
      }
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
