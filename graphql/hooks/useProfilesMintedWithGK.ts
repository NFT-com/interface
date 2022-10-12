import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfilesMintedWithGkQuery } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface ProfilesMintedWithGKQueryData {
  data: ProfilesMintedWithGkQuery
  loading: boolean;
  mutate: () => void;
}

export function useProfilesMintedWithGKQuery(tokenId: string, chainId?: string): ProfilesMintedWithGKQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);

  const keyString =
    'profilesMintedWithGKQuery' +
    tokenId +
    chainId;

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(tokenId) || isNullOrEmpty(chainId)) {
      return { profilesMintedWithGK: [] };
    }
    setLoading(true);
    try {
      const result = await sdk.ProfilesMintedWithGK({ tokenId, chainId });
      setLoading(false);
      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
      console.log('Failed to load profiles minted with GK.');
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
