import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { AuctionType, Maybe } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import crypto from 'crypto';
import { hashMessage } from 'ethers/lib/utils';
import { useContext } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount } from 'wagmi';

export interface PublicSaleHashResult {
  publicSaleHash: Maybe<{
    hash: string,
    signature: string,
  }>;
  mutate: () => void;
}

export function useGetPublicSaleHash() {
  const { data: account } = useAccount();
  const sdk = useGraphQLSDK();
  const { signed } = useContext(GraphQLContext);

  const keyString = 'useGetPublicSaleHash' + account?.address + signed;

  const { data } = useSWR(
    keyString,
    async () => {
      if (isNullOrEmpty(account?.address) || !signed || account?.address === undefined) {
        return null;
      }

      const timestamp = new Date().getTime();
      let poem = AuctionType.English +
        AuctionType.Decreasing +
        AuctionType.FixedPrice + '00016';
      
      for (let i = 0; i < 7; i++) {
        poem = hashMessage(poem);
      }

      const hmac = crypto.createHmac('sha256', String(poem));

      if (isNullOrEmpty(account?.address) || !signed) {
        return null;
      }
      const message = JSON.stringify({
        address: account?.address.toLowerCase(),
        timestamp: String(timestamp),
      });
      const signature = hmac.update(message).digest('hex');

      const data = await sdk.SignHash({
        input: {
          timestamp: String(timestamp)
        }
      }, {
        'x-mint-signature': String(signature)
      });
      return data?.signHash;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  return {
    publicSaleHash: data,
    mutate: () => {
      mutate(keyString);
    }
  };
}
