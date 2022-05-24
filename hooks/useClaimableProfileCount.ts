
import { Maybe } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useAllContracts } from './contracts/useAllContracts';
import { useOwnedGenesisKeyTokens } from './useOwnedGenesisKeyTokens';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface ClaimableCount {
  tokenId: number,
  claimable: number;
}

export interface ClaimableProfileCountResult {
  claimable: Maybe<ClaimableCount[]>;
  totalClaimable: Maybe<number>;
  loading: boolean;
  mutate: () => void;
}

/**
 * For a given address, return the number of remaining Profile claims on a per-GK basis
 */
export function useClaimableProfileCount(address: string): ClaimableProfileCountResult {
  const { profileAuction } = useAllContracts();
  const [loading, setLoading] = useState(false);

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(address);

  const keyString = 'ClaimableProfileCount ' + address + ownedGKTokens?.length;

  const { data } = useSWR(keyString,
    async () => {
      if (
        isNullOrEmpty(address) ||
        (!(process.env.NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED === 'true'))
      ) {
        return {
          claimableCounts: [],
          total: 0
        };
      }
      setLoading(true);
      try {
        const isWhitelistPhaseOnly: boolean = await profileAuction.genKeyWhitelistOnly();
  
        const promises: Promise<ClaimableCount>[] = (ownedGKTokens ?? []).map(async (tokenId) => {
          const claimedByThisTokenId = await profileAuction.genesisKeyClaimNumber(tokenId);
          return {
            tokenId,
            claimable: (isWhitelistPhaseOnly ? 4 : 7) - claimedByThisTokenId.toNumber()
          } as ClaimableCount;
        });
  
        const claimableCounts: ClaimableCount[] = await Promise.all(promises);
        const total = claimableCounts.reduce((
          previousValue: number,
          currentValue: ClaimableCount,
          currentIndex: number,
          array: ClaimableCount[]
        ) => previousValue + currentValue.claimable, 0);
  
        setLoading(false);
        return {
          claimableCounts,
          totalClaimable: total
        };
      } catch(error) {
        setLoading(false);
        return {
          claimableCounts: [],
          totalClaimable: 0,
        };
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    });
  
  return {
    claimable: data?.claimableCounts ?? null,
    totalClaimable: data?.totalClaimable ?? null,
    loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
