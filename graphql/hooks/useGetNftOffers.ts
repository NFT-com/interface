import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MarketAsk } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface GetNftOffersData {
  data: Array<PartialDeep<MarketAsk>>;
  loading: boolean;
  mutate: () => void;
}

export function useGetNftOffers(
  nftTokenId: string,
  nftContractAddress: string,
  makerAddress?: string
): GetNftOffersData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = `GetNftOffers ${nftContractAddress} ${nftTokenId} ${makerAddress}`;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    if(!nftTokenId || !nftContractAddress) return null;
    const result = await sdk.getNFTOffers({
      input: { nftTokenId, nftContractAddress, makerAddress }
    });
    setLoading(false);
    return result?.getNFTOffers;
  });

  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
