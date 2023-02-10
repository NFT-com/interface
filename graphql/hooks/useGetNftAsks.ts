import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MarketAsk, Maybe } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface GetNftAsksData {
  data: Array<PartialDeep<MarketAsk>>;
  loading: boolean;
  mutate: () => void;
}

export interface GetNFTAsksInput {
  makerAddress: Maybe<string>,
  nftContractAddress: string,
  nftTokenId: string,
}

export function useGetNftAsks({
  makerAddress,
  nftContractAddress,
  nftTokenId
}: GetNFTAsksInput): GetNftAsksData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const keyString = `GetNftAsks ${makerAddress} ${nftContractAddress} ${nftTokenId}`;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    if(!nftTokenId || !nftContractAddress) return null;
    const result = await sdk.getNFTAsks({
      input: {
        makerAddress: makerAddress,
        nftContractAddress: nftContractAddress,
        nftTokenId: nftTokenId
      }
    });
    setLoading(false);
    return result?.getNFTAsks;
  });

  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
