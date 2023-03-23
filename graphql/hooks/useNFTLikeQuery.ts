import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, isNullOrEmpty } from 'utils/helpers';

import { BigNumber, BigNumberish } from 'ethers';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

export interface NftLikeData {
  data: { __typename?: 'NFT'; likeCount?: number; isLikedByUser?: boolean; }
  loading: boolean;
  mutate: () => void;
}

export function useNftLikeQuery(contract: string, id: BigNumberish): NftLikeData {
  const sdk = useGraphQLSDK();
  const keyString = 'NftLikeQuery' + contract + id?.toString();

  const { chain } = useNetwork();

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || id == null) {
      return null;
    }

    const result = await sdk.NftLikeCount(
      {
        chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        contract,
        id: BigNumber.from(id).toHexString()
      }
    );
    return result?.nft;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
