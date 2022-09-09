import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ActivityStatus, PageInput, TxActivity } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate } from 'swr';
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

export function useActivitiesForAddressQuery(address: string, chainId: string, pageInput: PageInput): ActivitiesForAddressData {
  const sdk = useGraphQLSDK();
  const keyString = 'ActivitiesForAddressQuery' +
    chainId +
    address +
    pageInput.first +
    pageInput.afterCursor;

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(address) || isNullOrEmpty(chainId)) {
      return [];
    }
    const result = await sdk.Activities({
      input: {
        pageInput,
        chainId,
        walletAddress: address,
        status: ActivityStatus.Valid
      }
    });
    return result;
  });

  return {
    data: data ?? [],
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
