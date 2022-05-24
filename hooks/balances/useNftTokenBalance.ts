import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getAddress } from 'utils/httpHooks';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useNftTokenBalance(account: string): BalanceData | null {
  const { nftToken } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data } = useSWR(
    `${account}_${getAddress('nft', activeChain?.id)}_${activeChain?.id}_nft_balanceOf`,
    async () => {
      const balance = await nftToken.balanceOf(account);
      const decimals = await nftToken.decimals();
      return {
        balance: balance,
        decimals: decimals,
      };
    }
  );
  return data ?? null;
}
