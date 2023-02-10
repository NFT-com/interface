import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetMarketAsk } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface GetAsksData {
  data: PartialDeep<GetMarketAsk>;
  loading: boolean;
  mutate: () => void;
}

export function useGetAsks(
  makerAddress: string
): GetAsksData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = `GetAsks ${makerAddress}`;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.GetAsks({
      input: {
        makerAddress,
        pageInput: {
          first: 20
        }
      }
    });
    setLoading(false);
    return result?.getAsks;
  });

  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
