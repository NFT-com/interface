import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { MyNfTsQuery } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';

import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount, useNetwork } from 'wagmi';

export interface AssetsData {
  data: MyNfTsQuery;
  totalItems: number;
  loading: boolean;
  mutate: () => void;
}

export function useMyAssetsQuery(first: number, afterCursor: string): AssetsData {
  const sdk = useGraphQLSDK();
  const { signed } = useContext(GraphQLContext);
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const keyString = 'MyAssetsQuery' +
    currentAddress +
    String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) +
    signed +
    first +
    afterCursor;

  const { data } = useSWR(keyString, async () => {
    if (!currentAddress) {
      return { myNFTs: { items: [], totalItems: 0, loading: false } };
    }
    const result: MyNfTsQuery = await sdk.MyNFTs({
      input: {
        pageInput: { first: first, afterCursor: afterCursor },
        ownedByWallet: true
      }
    });
    return result;
  });
  
  return {
    data: data,
    totalItems: data?.myNFTs?.totalItems ?? 0,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
