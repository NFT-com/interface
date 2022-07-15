import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileQuery } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback,useState } from 'react';
import { useNetwork } from 'wagmi';

export interface FetchProfile {
  fetchProfile: (url: string) => Promise<ProfileQuery>;
  loading: boolean;
}

export function useFetchProfile(): FetchProfile {
  const sdk = useGraphQLSDK();
  const { activeChain } = useNetwork();

  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (url: string) => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.Profile({ url, chainId: String(activeChain?.id) });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to fetch profile. It might be unminted.');
      return null;
    }
  }, [activeChain?.id, sdk]);

  return {
    fetchProfile,
    loading: loading
  };
}
