import { useDaiBalance } from 'hooks/balances/useDaiBalance';
import { useUsdcBalance } from 'hooks/balances/useUsdcBalance';
import { useWethBalance } from 'hooks/balances/useWethBalance';
import { BalanceData } from 'types';

import { useEthBalance } from './useEthBalance';

export interface AllBalances {
  dai: BalanceData | null;
  weth: BalanceData | null;
  usdc: BalanceData | null;
  eth: BalanceData;
}

export function useBalances(currentAddress: string): AllBalances {
  const daiBalance = useDaiBalance(currentAddress);
  const usdcBalance = useUsdcBalance(currentAddress);
  const wethBalance = useWethBalance(currentAddress);
  const ethBalance = useEthBalance(currentAddress);
  return {
    dai: daiBalance,
    weth: wethBalance,
    usdc: usdcBalance,
    eth: ethBalance.balance,
  };
}
