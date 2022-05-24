import { useAllContracts } from 'hooks/contracts/useAllContracts';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useDaiAllowance(
  account: string,
  spender: string | null | undefined
): {allowance: BalanceData | null; mutate: () => void} {
  const { dai } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data, mutate } = useSWR(`${activeChain?.id}_Dai_allowance_${account}`, async () => {
    if (spender == null) {
      return null;
    }
    const balance = await dai.allowance(account, spender);
    const decimals = await dai.decimals();
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
