import { Maybe } from 'graphql/generated/types';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';

import { useAlchemySDK } from './useAlchemySDK';

import { GetNftsResponse, Nft } from '@alch/alchemy-web3';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

/**
 * Return array of token IDs for the owned Genesis Key tokens for this address.
 * e.g. [3, 4, 1234] if the input address owned GKs with IDs 3, 4, and 1234.
 * reminder: Genesis Key Token IDs are 1-indexed, not 0-indexed
 */
export function useOwnedGenesisKeyTokens(address: Maybe<string>): {
  data: Maybe<number[]>,
  loading: boolean,
  mutate: () => void
} {
  const [loading, setLoading] = useState(false);
  const { activeChain } = useNetwork();
  const alchemySdk = useAlchemySDK();

  const keyString = 'OwnedGenesisKeyTokens' + address + activeChain?.id;

  const { data } = useSWR(keyString, async () => {
    if (
      isNullOrEmpty(address) ||
      address == null ||
      (process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'false')
    ) {
      return [];
    }
    setLoading(true);

    const result: GetNftsResponse = await alchemySdk.alchemy.getNfts({
      owner: address,
      contractAddresses: [getAddress('genesisKey', activeChain?.id)]
    });

    setLoading(false);
    return filterNulls(result?.ownedNfts.map((gk: Nft) => BigNumber.from(gk?.id?.tokenId)?.toNumber()) ?? []);
  });

  return {
    data: data ?? null,
    loading,
    mutate: () => {
      mutate(keyString);
    }
  };
}
