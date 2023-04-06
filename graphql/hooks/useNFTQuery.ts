import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, isNullOrEmpty } from 'utils/helpers';

import { BigNumber, BigNumberish } from 'ethers';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface NftData {
  data: PartialDeep<Nft>;
  loading: boolean;
  mutate: () => void;
}

// listingsOwner is optional, but if it is provided, it filters NFT listings by that address
export function useNftQuery(contract: string, id: BigNumberish, listingsOwner?: string): NftData {
  const sdk = useGraphQLSDK();
  const keyString = 'NftQuery ' + contract + id + listingsOwner;

  const defaultChainId = useDefaultChainId();

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || id == null || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== defaultChainId) {
      return null;
    }
    
    // All NFT IDs are stored in hex string format.
    const input = listingsOwner ?
      { chainId: getChainIdString(defaultChainId) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID), contract, id: BigNumber.from(id).toHexString(), listingsOwner } :
      { chainId: getChainIdString(defaultChainId) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID), contract, id: BigNumber.from(id).toHexString() };

    const result = await sdk.Nft(input);
    return result?.nft;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
