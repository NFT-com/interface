import { Maybe } from 'graphql/generated/types';
import { getNftMetadata } from 'utils/alchemyNFT';
import { Doppler, getEnv } from 'utils/env';
import { getAddress } from 'utils/httpHooks';

import { BigNumberish } from 'ethers';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export function useGenesisKeyMetadata(tokenId: BigNumberish | null): Maybe<any> {
  const { activeChain } = useNetwork();

  const keyString = 'GenesisKeyMetadata' + tokenId + activeChain?.id;

  const { data } = useSWR(
    keyString,
    async () => {
      if (tokenId == null) {
        return null;
      }
      const result = await getNftMetadata(
        getAddress('genesisKey', activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
        tokenId,
        activeChain?.id ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)
      );
      
      return result;
    }
  );

  return data ?? null;
}