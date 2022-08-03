import { Maybe } from 'graphql/generated/types';
import { getNftsByContractAndOwner } from 'utils/alchemyNFT';
import { Doppler,getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { AlchemyOwnedNFT } from 'types';
import { useNetwork } from 'wagmi';

/**
 * Return array of token information for the owned Genesis Key tokens for this address.
 * reminder: Genesis Key Token IDs are 1-indexed, not 0-indexed
 */
export function useOwnedGenesisKeyTokens(address: Maybe<string>): {
  data: Maybe<AlchemyOwnedNFT[]>,
  loading: boolean,
  mutate: () => void
} {
  const [loading, setLoading] = useState(false);
  const { chain } = useNetwork();

  const keyString = 'OwnedGenesisKeyTokens' + address + chain?.id;

  const { data } = useSWR(keyString, async () => {
    if (
      isNullOrEmpty(address) ||
      address == null
    ) {
      return [];
    }
    setLoading(true);

    const result = await getNftsByContractAndOwner(
      address,
      getAddress('genesisKey', chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
      chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
      null // pageKey
    );
    const ownedTokens = result?.ownedNfts;
    let pageKey = result?.pageKey;
    if (result?.pageKey) {
      // There are further pages to load.
      const nextPage = await getNftsByContractAndOwner(
        address,
        getAddress('genesisKey', chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
        chain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        pageKey
      );
      ownedTokens.push(...nextPage?.ownedNfts as AlchemyOwnedNFT[]);
      pageKey = nextPage?.pageKey;
    }

    setLoading(false);
    return ownedTokens;
  });

  return {
    data: data ?? null,
    loading,
    mutate: () => {
      mutate(keyString);
    }
  };
}
