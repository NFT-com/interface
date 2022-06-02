import { getNftsByContract } from 'utils/alchemyNFT';
import { Doppler,getEnv } from 'utils/env';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import { useAllContracts } from './contracts/useAllContracts';

import { Nft } from '@alch/alchemy-web3';
import { BigNumber, BigNumberish } from 'ethers';
import useSWR, { mutate } from 'swr';
import { useAccount, useNetwork } from 'wagmi';

export interface OwnedToken {
  id: BigNumberish,
  uri: string,
}

export interface ProfileTokenResults {
  profileTokens: OwnedToken[];
  profileUris: string[];
  error: any;
  mutate: () => void;
}

export function useMyNftProfileTokens(): ProfileTokenResults {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { nftProfile } = useAllContracts();

  const keyString = 'MyNftProfileTokens ' + account?.address + activeChain?.id;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(account?.address) || account?.address == null) {
      return null;
    }

    const result = await getNftsByContract(
      account?.address,
      getAddress('nftProfile', activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
      activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)
    );

    const ownedTokenIds = filterNulls(result?.ownedNfts?.map((profile: Nft) => BigNumber.from(profile?.id?.tokenId)?.toNumber()));
    
    const ownedTokenUris: string[] = await Promise.all(ownedTokenIds.map(id => {
      return nftProfile.tokenURI(id).then((uri: string) => {
        return uri;
      });
    }));
    return ownedTokenIds.map((id, index) => ({ id, uri: ownedTokenUris[index] }));
  });
  
  return {
    profileTokens: data ?? [],
    profileUris: (data ?? []).map(item => item.uri),
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
