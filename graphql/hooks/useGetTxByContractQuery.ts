import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { NftPortTxByContract } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

export interface TxData {
  data: NftPortTxByContract;
  loading: boolean;
  mutate: () => void;
}

export function useGetTxByContractQuery(contractAddress: string): TxData {
  const sdk = useGraphQLSDK();
  const { chain } = useNetwork();

  const keyString = 'GetTxByContractQuery ' + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + contractAddress;

  const { data } = useSWR(keyString, async () => {
    if(chain?.id !== 1 && getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== '1') {
      return null;
    }
    if(isNullOrEmpty(contractAddress)) {
      return null;
    }

    const result = await sdk.GetTxByContract({
      input: {
        contractAddress
      }
    });
    return result;
  });
  
  return {
    data: data?.getTxByContract ?? null,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}