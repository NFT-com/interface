import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ContractSalesStatistics } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';

import useSWR, { mutate } from 'swr';
import { useNetwork } from 'wagmi';

export interface ContractSalesStatisticsData {
  data: ContractSalesStatistics;
  loading: boolean;
  mutate: () => void;
}

export function useGetContractSalesStatisticsQuery(contractAddress: string): ContractSalesStatisticsData {
  const sdk = useGraphQLSDK();
  const { chain } = useNetwork();

  const keyString = 'GetContractSalesStatisticsQuery ' + String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)) + contractAddress;

  const { data } = useSWR(keyString, async () => {
    if(chain?.id !== 1 && getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) !== '1') {
      return null;
    }
    if(isNullOrEmpty(contractAddress)) {
      return null;
    }

    const result = await sdk.GetContractSalesStatistics({
      input: {
        contractAddress
      }
    });
    return result;
  });

  return {
    data: data?.getContractSalesStatistics ?? null,
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
