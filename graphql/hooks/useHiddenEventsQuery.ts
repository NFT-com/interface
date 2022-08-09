import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { HiddenEventsInput, HiddenEventsQuery } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface HiddenEventsQueryData {
  data: HiddenEventsQuery;
  loading: boolean;
  mutate: () => void;
}

export function useHiddenEventsQuery(input: HiddenEventsInput): HiddenEventsQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'HiddenEventsQuery' +
      input.profileUrl +
      input.walletAddress +
      input?.chainId;
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.HiddenEvents({ input: input });
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