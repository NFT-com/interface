import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfilesMintedWithGkQuery, TopBidsInput, TopBidsQuery } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface ProfilesMintedWithGKQueryData {
  data: ProfilesMintedWithGkQuery
  loading: boolean;
  mutate: () => void;
}

export function useProfilesMintedWithGKQuery(tokenId: string): ProfilesMintedWithGKQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);

  const keyString =
    'profilesMintedWithGKQuery' +
    tokenId;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.ProfilesMintedWithGK({ tokenId });
      setLoading(false);
      return result;
    } catch (error) {
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
