import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MyNfTsQuery, Nft, PageInfo } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty, profileSaveCounter } from 'utils/helpers';

import { useAtom } from 'jotai';
import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export interface NftsData {
  data: PartialDeep<Nft>[],
  pageInfo: PageInfo,
  totalItems: number,
  loading: boolean,
  mutate: () => void,
}

export function useMyNFTsQuery(first: number, profileId: string, beforeCursor?: string, query?: string): NftsData {
  const sdk = useGraphQLSDK();
  const { signed } = useContext(GraphQLContext);
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const [savedCount,] = useAtom(profileSaveCounter);
  const keyString = 'MyNFTsQuery ' + currentAddress + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + signed + first + profileId + beforeCursor + savedCount + query;

  const { data } = useSWR(keyString, async () => {
    if (!currentAddress || isNullOrEmpty(profileId)) {
      return { myNFTs: { items: [], totalItems: 0, loading: false, pageInfo: {} } };
    }
    const result: MyNfTsQuery = await sdk.MyNFTs({
      input: {
        pageInput: { first: first, beforeCursor: beforeCursor },
        // profileId: profileId,
        ownedByWallet: true,
        ...(query && { query })
      }
    });
    return result;
  });
  
  return {
    data: data?.myNFTs?.items ?? [],
    pageInfo: data?.myNFTs.pageInfo,
    totalItems: data?.myNFTs?.totalItems ?? 0,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}