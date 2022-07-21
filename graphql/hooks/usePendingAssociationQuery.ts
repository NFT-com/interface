import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export function usePendingAssociationQuery() {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'GetMyPendingAssociationsQuery';
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.GetMyPendingAssociations();
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
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