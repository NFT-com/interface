import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft, PageInput } from 'graphql/generated/types';

import { DeepPartial } from '@reduxjs/toolkit';
import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount, useNetwork } from 'wagmi';

export interface NftsData {
  data: DeepPartial<Nft>[];
  totalItems: number,
  loading: boolean;
  mutate: () => void;
}

export function useMyNFTsQuery(pageInput: PageInput): NftsData {
  const sdk = useGraphQLSDK();
  const { signed } = useContext(GraphQLContext);
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const [loading, setLoading] = useState(false);
  const keyString = 'MyNFTsQuery ' + account?.address + activeChain?.id + signed;

  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    const result = await sdk.MyNFTs({
      input: {
        pageInput
      }
    });
    setLoading(false);
    return result;
  });
  return {
    data: data?.myNFTs.items ?? [],
    totalItems: data?.myNFTs?.totalItems ?? 0,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
