import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe } from 'graphql/generated/types';

import delay from 'delay';
import { useCallback, useState } from 'react';

export interface RefreshNftResult {
  loading: boolean;
  error: string | null;
  refreshNft: (nftId: string) => Promise<boolean>
}

export function useRefreshNftMutation(): RefreshNftResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const refreshNft = useCallback(
    async (nftId: string) => {
      setLoading(true);
      try {
        await delay(1500); // give more UI time for user
        await sdk.RefreshNft({ id: nftId });
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
    refreshNft: refreshNft,
  };
}
