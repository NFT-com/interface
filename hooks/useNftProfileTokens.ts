import { getNftsByContract } from 'utils/alchemyNFT';
import { Doppler,getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import useSWR, { mutate } from 'swr';
import { AlchemyOwnedNFT } from 'types';
import { useNetwork } from 'wagmi';

export interface ProfileTokenResults {
  profileTokens: AlchemyOwnedNFT[];
  error: any;
  mutate: () => void;
}

export function useNftProfileTokens(owner: string): ProfileTokenResults {
  const { activeChain } = useNetwork();

  const keyString = 'NftProfileTokens ' + owner + activeChain?.id;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(owner) || owner == null) {
      return null;
    }

    const result = await getNftsByContract(
      owner,
      getAddress('nftProfile', activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
      activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
      null // pageKey
    );
    const ownedTokens = result?.ownedNfts;
    let pageKey = result?.pageKey;
    while (pageKey != null) {
      // There are further pages to load.
      const nextPage = await getNftsByContract(
        owner,
        getAddress('nftProfile', activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
        activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        pageKey
      );
      ownedTokens.push(...nextPage?.ownedNfts as AlchemyOwnedNFT[]);
      pageKey = nextPage?.pageKey;
    }
    return ownedTokens;
  });
  
  return {
    profileTokens: data ?? [],
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
