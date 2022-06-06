import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';

import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export interface NftsData {
  data: PartialDeep<Nft>[];
  totalItems: number,
  loading: boolean;
  mutate: () => void;
}

export function useMyNFTsQuery(first: number): NftsData {
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
        pageInput: { first: first }
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
