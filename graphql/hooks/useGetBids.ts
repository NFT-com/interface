import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetMarketBid } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface GetBidsData {
  data: PartialDeep<GetMarketBid>;
  loading: boolean;
  mutate: () => void;
}

export function useGetBids(
  marketAskId?: string,
  makerAddress?: string
): GetBidsData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = `GetBids ${marketAskId} ${makerAddress}`;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.GetBids({
      input: {
        marketAskId,
        makerAddress,
        pageInput: {
          first: 20
        }
      }
    });
    setLoading(false);
    return result?.getBids;
  });

  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}