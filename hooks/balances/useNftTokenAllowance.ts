import { useAllContracts } from 'hooks/contracts/useAllContracts';

import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useNftTokenAllowance(
  account: string,
  spender: string | null | undefined
): {allowance: BalanceData | null; mutate: () => void} {
  const { nftToken } = useAllContracts();
  const { activeChain } = useNetwork();
  const { data, mutate } = useSWR(`${activeChain?.id}_nft_allowance_${account}`, async () => {
    if (spender == null) {
      return null;
    }
    const balance = await nftToken.allowance(account, spender);
    const decimals = await nftToken.decimals();
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
