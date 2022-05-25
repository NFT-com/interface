import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Bid, NftType } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface MyGKProfileBids {
  bids: PartialDeep<Bid>[];
  error: any;
  mutate: () => void;
}

export function useMyGKProfileBids(): MyGKProfileBids {
  const sdk = useGraphQLSDK();

  const { data: account } = useAccount();
  const { signed } = useContext(GraphQLContext);

  const keyString = 'MyGenesisKeyProfileBids ' + account?.address + signed;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(account?.address) || !signed) {
      return null;
    }
    const result = await sdk.MyBids({
      input: {
        pageInput: {
          first: 10
        },
        nftType: NftType.GenesisKeyProfile
      }
    });
    
    return result?.myBids?.items;
  });
  return {
    bids: data ?? [],
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
