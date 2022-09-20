import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, isNullOrEmpty } from 'utils/helpers';

import { BigNumber, BigNumberish } from 'ethers';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface NftData {
  data: PartialDeep<Nft>;
  loading: boolean;
  mutate: () => void;
}

export function useNftQuery(contract: string, id: BigNumberish): NftData {
  const sdk = useGraphQLSDK();
  const keyString = 'NftQuery ' + contract + id;

  const { chain } = useNetwork();

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || id == null) {
      return null;
    }
    // All NFT IDs are stored in hex string format.
    const result = await sdk.Nft({
      contract,
      id: BigNumber.from(id).toHexString() ,
      chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
    });
    return result?.nft;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
