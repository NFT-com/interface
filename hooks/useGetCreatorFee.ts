import { StagedListing } from 'components/modules/Checkout/NFTListingsContext';
import { StagedPurchase } from 'components/modules/Checkout/NFTPurchaseContext';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface NFTDetailsData {
  data: number;
  loading: boolean;
  mutate: () => void;
}

export function useGetCreatorFee(
  contractAddress: string,
  tokenId: string
): NFTDetailsData {
  const { chain } = useNetwork();

  const keyString = 'GetCreatorFee ' + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + contractAddress + tokenId;

  const { data } = useSWR(keyString, async () => {
    if(chain?.id !== 1 && getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== '1') {
      return null;
    }
    if(isNullOrEmpty(contractAddress) || tokenId == null) {
      return null;
    }

    return 10;
  });

  return {
    data: data ?? 0,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}