import { useAllContracts } from 'hooks/contracts/useAllContracts';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useWethAllowance(
  account: string,
  spender: string | null | undefined
): {allowance: BalanceData | null; mutate: () => void} {
  const { weth } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data, mutate } = useSWR(`${activeChain?.id}_weth_allowance_${account}_${spender}`, async () => {
    if (spender == null) {
      return null;
    }
    const balance = await weth.allowance(account, spender);
    const decimals = await weth.decimals();
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
