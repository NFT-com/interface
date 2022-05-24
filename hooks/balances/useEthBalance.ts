import { BigNumber } from 'ethers';
import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork, useProvider } from 'wagmi';

export function useEthBalance(
  account: string
): {balance: BalanceData; mutate: () => void} {
  const { activeChain } = useNetwork();
  const provider = useProvider({ chainId: activeChain?.id });
  const { data, mutate } = useSWR(
    `${activeChain?.id}_eth_balance_${account}`,
    async () => {
      const balance = await provider?.getBalance(account);
      return {
        balance: balance,
        decimals: 18,
      };
    });
  return {
    balance: data ?? {
      balance: BigNumber.from(0),
      decimals: 18
    },
    mutate: mutate,
  };
}
