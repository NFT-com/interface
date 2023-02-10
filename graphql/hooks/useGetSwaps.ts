import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetMarketSwap } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface GetSwapsData {
  data: PartialDeep<GetMarketSwap>;
  loading: boolean;
  mutate: () => void;
}

export function useGetSwaps(
  makerAddress: string
): GetSwapsData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = `GetSwaps ${makerAddress}`;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.GetUserSwaps({
      input: {
        participant: makerAddress,
        pageInput: {
          first: 20
        }
      }
    });
    setLoading(false);
    return result?.getUserSwaps;
  });

  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
