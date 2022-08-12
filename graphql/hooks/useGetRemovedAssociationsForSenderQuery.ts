import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetRemovedAssociationsForSenderQuery, QueryGetRemovedAssociationsForSenderArgs } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface GetRemovedAssociationsForSenderQueryData {
  data: GetRemovedAssociationsForSenderQuery
  loading: boolean;
  mutate: () => void;
}

export function useGetRemovedAssociationsForSender(input: QueryGetRemovedAssociationsForSenderArgs): GetRemovedAssociationsForSenderQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'GetRemovedAssociationsForSenderQuery' + input.profileUrl;
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.GetRemovedAssociationsForSender({
        profileUrl: input.profileUrl
      });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to removed associations for sender');
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