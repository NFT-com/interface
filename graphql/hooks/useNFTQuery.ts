import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';

import { useCallback, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface NftData {
  data: PartialDeep<Nft>;
  loading: boolean;
  mutate: () => void;
}

export function useNftQuery(contract: string, id: string): NftData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = 'NftQuery ' + contract + id;

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.Nft({ contract, id });
    setLoading(false);
    return result?.nft;
  });
  return {
    data: data,
    loading: loading,
    mutate: mutateThis,
  };
}
