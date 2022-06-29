import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';

import { useContext } from 'react';
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
  const keyString = 'MyNFTsQuery ' + account?.address + activeChain?.id + signed;

  const { data } = useSWR(keyString, async () => {
    if (!account) {
      return [];
    }
    const result = await sdk.MyNFTs({
      input: {
        pageInput: { first: first }
      }
    });
    return result?.myNFTs?.items;
  });
  return {
    data: data ?? [],
    totalItems: data?.length ?? 0,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
