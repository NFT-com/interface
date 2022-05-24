import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { getAddress } from 'utils/httpHooks';

import { useContext } from 'react';
import useSWR from 'swr';
import { BalanceData } from 'types';
import { useNetwork } from 'wagmi';

export function useWethBalance(account: string): BalanceData | null {
  const { weth } = useAllContracts();
  const { activeChain } = useNetwork();
  const { signed } = useContext(GraphQLContext);
  const { data } = useSWR(
    `${account}_${getAddress('weth', activeChain?.id)}_${activeChain?.id}_nft_balanceOf${signed}`,
    async () => {
      const balance = await weth.balanceOf(account);
      const decimals = await weth.decimals();
      return {
        balance: balance,
        decimals: decimals,
      };
    }
  );
  return data ?? null;
}
