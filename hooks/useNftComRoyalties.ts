import { StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { ExternalProtocol } from 'types';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

export interface NftComRoyaltyData {
  data: number[];
  loading: boolean;
  mutate: () => void;
}

export function useNftComRoyalties(toList: StagedListing[]): NftComRoyaltyData {
  const { marketplace } = useAllContracts();
  const keyString = 'NFTCOMRoyaltyFee' + JSON.stringify(toList.map(i => i?.nft?.contract + i?.nft?.tokenId));

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(
    keyString,
    async () => {
      return await Promise.all((toList).map(async (stagedListing) => {
        const targetProtocols = await stagedListing.targets.map((target) => target.protocol);
        if (targetProtocols.includes(ExternalProtocol.NFTCOM)) {
          return Number((await marketplace.royaltyInfo(stagedListing.nft?.contract))?.[1]);
        } else {
          return 0;
        }
      },
      {
        refreshInterval: 0,
        revalidateOnFocus: false,
      }));
    }
  );

  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
