import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetRemovedAssociationsForReceiverQuery } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface GetRemovedAssociationsForReceiverQueryData {
  data: GetRemovedAssociationsForReceiverQuery
  loading: boolean;
  mutate: () => void;
}

export function useGetRemovedAssociationsForReceiver(): GetRemovedAssociationsForReceiverQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'GetRemovedAssociationsForReceiverQuery';
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.GetRemovedAssociationsForReceiver();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to load leaderboard.');
    }
  });
  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}