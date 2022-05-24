import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Bid, NftType } from 'graphql/generated/types';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { isNullOrEmpty } from 'utils/helpers';

import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface MyGenesisKeyBid {
  bid: PartialDeep<Bid>;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useMyGenesisKeyBid(): MyGenesisKeyBid {
  const sdk = useGraphQLSDK();

  const { data: account } = useAccount();
  const { signed } = useContext(GraphQLContext);
  const { isSupported } = useSupportedNetwork();
  const [loading, setLoading] = useState(false);

  const keyString = 'MyGenesisKeyBid ' + account?.address + signed;

  const { data, error } = useSWR(keyString, async () => {
    if (
      isNullOrEmpty(account?.address) ||
      (!signed) ||
      (!isSupported) ||
      process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true'
    ) {
      return null;
    }
    setLoading(true);
    const result = await sdk.MyBids({
      input: {
        pageInput: {
          first: 1
        },
        nftType: NftType.GenesisKey
      }
    });
    setLoading(false);
    return result?.myBids?.items?.[0];
  });
  return {
    bid: data,
    error: error,
    loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
