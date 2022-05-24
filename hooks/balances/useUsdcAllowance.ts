import { useAllContracts } from 'hooks/contracts/useAllContracts';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useUsdcAllowance(
  account: string,
  spender: string | null | undefined
): {allowance: BalanceData | null; mutate: () => void} {
  const { usdc } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data, mutate } = useSWR(`${activeChain?.id}_Usdc_allowance_${account}`, async () => {
    if (spender == null) {
      return null;
    }
    const balance = await usdc.allowance(account, spender);
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
