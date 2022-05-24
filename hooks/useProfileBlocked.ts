import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { isNullOrEmpty } from 'utils/helpers';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface ProfileBlocklistResult {
  blocked: boolean;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useProfileBlocked(inputURL: string, blockReserved: boolean): ProfileBlocklistResult {
  const sdk = useGraphQLSDK();

  const [loading, setLoading] = useState(false);

  const keyString = 'ProfileBlocklist' + inputURL + blockReserved;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(inputURL)) {
      return false;
    }
    setLoading(true);

    const data = await sdk.ProfileBlocklist({
      url: inputURL,
      blockReserved
    });

    setLoading(false);
    return data?.blockedProfileURI;
  });
  
  return {
    blocked: data ?? false,
    loading,
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
