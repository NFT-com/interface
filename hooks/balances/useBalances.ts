// import { useDaiBalance } from 'hooks/balances/useDaiBalance';
// import { useNftTokenBalance } from 'hooks/balances/useNftTokenBalance';
// import { useUsdcBalance } from 'hooks/balances/useUsdcBalance';
// import { useWethBalance } from 'hooks/balances/useWethBalance';
import { useEthBalance } from './useEthBalance';

import { BalanceData } from 'types';

export interface AllBalances {
  // nft: BalanceData | null;
  // dai: BalanceData | null;
  // weth: BalanceData | null;
  // usdc: BalanceData | null;
  eth: BalanceData;
}

export function useBalances(currentAddress: string): AllBalances {
  // TODO: re-add these for the marketplace launch.
  // const nftBalance = useNftTokenBalance(currentAddress);
  // const daiBalance = useDaiBalance(currentAddress);
  // const usdcBalance = useUsdcBalance(currentAddress);
  // const wethBalance = useWethBalance(currentAddress);
  const ethBalance = useEthBalance(currentAddress);
  return {
    // nft: nftBalance,
    // dai: daiBalance,
    // weth: wethBalance,
    // usdc: usdcBalance,
    eth: ethBalance.balance,
  };
}
