import { Maybe } from 'graphql/generated/types';
import { getAddress } from 'utils/httpHooks';

import { useAlchemySDK } from './useAlchemySDK';

import { GetNftMetadataResponse } from '@alch/alchemy-web3';
import { BigNumber, BigNumberish } from 'ethers';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';

export function useGenesisKeyMetadata(tokenId: BigNumberish | null): Maybe<any> {
  const { activeChain } = useNetwork();
  const alchemySdk = useAlchemySDK();

  const keyString = 'GenesisKeyMetadata' + tokenId + activeChain?.id;

  const { data } = useSWR(
    keyString,
    async () => {
      if (tokenId == null) {
        return null;
      }

      const result: GetNftMetadataResponse = await alchemySdk.alchemy.getNftMetadata({
        contractAddress: getAddress('genesisKey', activeChain?.id),
        tokenId: BigNumber.from(tokenId).toString(),
        tokenType: 'erc721'
      });
      
      return result;
    }
  );

  return data ?? null;
}