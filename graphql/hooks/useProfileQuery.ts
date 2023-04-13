import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileQuery } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, isNullOrEmpty } from 'utils/format';

import useSWR, { mutate,SWRConfiguration } from 'swr';
import { useNetwork } from 'wagmi';

export interface ProfileData {
  profileData: ProfileQuery;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useProfileQuery(
  url: string, options?: SWRConfiguration
): ProfileData {
  const sdk = useGraphQLSDK();
  const { chain } = useNetwork();

  const keyString = 'ProfileQuery ' + url + chain?.id;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      const result = await sdk.Profile({
        url,
        chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        likedById: ''
      });
      return result;
    } catch (error) {
      console.log('Failed to fetch profile. It might be unminted.');
      return null;
    }
  }, options);

  return {
    profileData: data,
    loading: data == null,
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
