import { isNullOrEmpty } from 'utils/helpers';

import { useSeaportContract } from './contracts/useSeaportContract';

import { BigNumber } from 'ethers';
import useSWR from 'swr';
import { useProvider } from 'wagmi';

export function useSeaportCounter(address: string): number {
  const provider = useProvider();
  const seaport = useSeaportContract(provider);
  const { data } = useSWR('seaportCounter' + address, async () => {
    if (isNullOrEmpty(address)) {
      return BigNumber.from(0);
    }
    return await seaport.getCounter(address);
  });
  return data?.toNumber();
}