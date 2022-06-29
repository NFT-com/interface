import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface NftData {
  data: PartialDeep<Nft>;
  loading: boolean;
  mutate: () => void;
}

export function useNftQuery(contract: string, id: string): NftData {
  const sdk = useGraphQLSDK();
  const keyString = 'NftQuery ' + contract + id;

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(id)) {
      return null;
    }
    const result = await sdk.Nft({ contract, id });
    return result?.nft;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
