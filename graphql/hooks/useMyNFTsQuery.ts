import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MyNfTsQuery, Nft } from 'graphql/generated/types';

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
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const keyString = 'MyNFTsQuery ' + currentAddress + chain.id + signed + first;

  const { data } = useSWR(keyString, async () => {
    if (!currentAddress) {
      return { myNFTs: null };
    }
    const result: MyNfTsQuery = await sdk.MyNFTs({
      input: {
        pageInput: { first: first }
      }
    });
    return result;
  });
  return {
    data: data?.myNFTs?.items ?? [],
    totalItems: data?.myNFTs?.totalItems ?? 0,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
