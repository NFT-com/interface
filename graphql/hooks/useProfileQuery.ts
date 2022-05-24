import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileQuery } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useState } from 'react';
import useSWR, { mutate,SWRConfiguration } from 'swr';

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
  const [loading, setLoading] = useState(false);

  const keyString = 'ProfileQuery ' + url;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.Profile({ url });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to fetch profile. It might be unminted.');
    }
  }, options);

  return {
    profileData: data,
    loading: loading,
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
