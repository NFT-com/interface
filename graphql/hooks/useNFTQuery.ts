import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';

import { DeepPartial } from '@reduxjs/toolkit';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface NftData {
  data: DeepPartial<Nft>;
  loading: boolean;
  mutate: () => void;
}

export function useNftQuery(contract: string, id: string): NftData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = 'NftQuery ' + contract;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.Nft({ contract, id });
    setLoading(false);
    return result?.nft;
  });
  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
