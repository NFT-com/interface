import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getAddress } from 'utils/httpHooks';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useUsdcBalance(account: string): BalanceData | null {
  const { usdc } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data } = useSWR(
    `${account}_${getAddress('usdc', activeChain?.id)}_${activeChain?.id}_nft_balanceOf`,
    async () => {
      const balance = await usdc.balanceOf(account);
      const decimals = await usdc.decimals();
      return {
        balance: balance,
        decimals: decimals,
      };
    }
  );
  return data ?? null;
}
