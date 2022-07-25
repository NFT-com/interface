import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileQuery } from 'graphql/generated/types';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { getFallbackChainIdFromSupportedNetwork, isNullOrEmpty } from 'utils/helpers';

import { useCallback,useState } from 'react';
import { useNetwork } from 'wagmi';

export interface FetchProfile {
  fetchProfile: (url: string) => Promise<ProfileQuery>;
  loading: boolean;
}

export function useFetchProfile(): FetchProfile {
  const sdk = useGraphQLSDK();
  const { chain } = useNetwork();
  const { supportedNetworks } = useSupportedNetwork();

  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (url: string) => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.Profile({
        url,
        chainId: String(chain.id ?? getFallbackChainIdFromSupportedNetwork(supportedNetworks[0])),
      });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to fetch profile. It might be unminted.');
      return null;
    }
  }, [chain.id, sdk, supportedNetworks]);

  return {
    fetchProfile,
    loading: loading
  };
}
