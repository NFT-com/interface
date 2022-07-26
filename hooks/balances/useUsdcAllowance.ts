import { useAllContracts } from 'hooks/contracts/useAllContracts';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useUsdcAllowance(
  currentAddress: string,
  spender: string | null | undefined
): {allowance: BalanceData | null; mutate: () => void} {
  const { usdc } = useAllContracts();
  const { chain } = useNetwork();
  const { data, mutate } = useSWR(`${chain?.id}_Usdc_allowance_${currentAddress}`, async () => {
    if (spender == null) {
      return null;
    }
    const balance = await usdc.allowance(currentAddress, spender);
    const decimals = await usdc.decimals();
    return {
      balance: balance,
      decimals: decimals,
    };
  });
  return {
    allowance: data ?? null,
    mutate: mutate,
  };
}
