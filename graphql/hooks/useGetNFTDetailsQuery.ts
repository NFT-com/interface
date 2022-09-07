import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { NftDetail } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

export interface NFTDetailsData {
  data: NftDetail;
  loading: boolean;
  mutate: () => void;
}

export function useGetNFTDetailsQuery(contractAddress: string, tokenId: string): NFTDetailsData {
  const sdk = useGraphQLSDK();
  const { chain } = useNetwork();

  const keyString = 'GetNFTDetailsQuery ' + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + contractAddress + tokenId;

  const { data } = useSWR(keyString, async () => {
    if(chain?.id !== 1 || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== 1) {
      return null;
    }
    if(isNullOrEmpty(contractAddress) || tokenId == null) {
      return null;
    }

    const result = await sdk.GetNFTDetails({
      input: {
        contractAddress,
        tokenId
      }
    });
    return result;
  });

  return {
    data: data?.getNFTDetails ?? null,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}