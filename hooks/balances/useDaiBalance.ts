import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getAddress } from 'utils/httpHooks';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useDaiBalance(account: string): BalanceData | null {
  const { dai } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data } = useSWR(
    `${account}_${getAddress('dai', activeChain?.id)}_${activeChain?.id}_nft_balanceOf`,
    async () => {
      const balance = await dai.balanceOf(account);
      const decimals = await dai.decimals();
      return {
        balance: balance,
        decimals: decimals,
      };
    }
  );
  return data ?? null;
}
