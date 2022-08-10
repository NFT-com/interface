import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { IgnoredEventsInput,IgnoredEventsQuery } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface IgnoredEventsQueryData {
  data: IgnoredEventsQuery;
  loading: boolean;
  mutate: () => void;
}

export function useIgnoredEventsQuery(input: IgnoredEventsInput): IgnoredEventsQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'IgnoredEventsQuery' +
      input.profileUrl +
      input.walletAddress +
      input?.chainId;
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.IgnoredEvents({ input: input });
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