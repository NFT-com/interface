import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe } from 'graphql/generated/types';

import { useCallback,useState } from 'react';

export function useRefreshNftOrdersMutation() {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);
  
  const refreshNftOrders = useCallback(
    async (nftId: string) => {
      setLoading(true);
      try {
        await sdk.RefreshNftOrders({ id: nftId });
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Mutation failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );
  
  return {
    loading: loading,
    error: error,
    refreshNftOrders: refreshNftOrders,
  };
}