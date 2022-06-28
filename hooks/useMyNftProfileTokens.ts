import { ProfileTokenResults, useNftProfileTokens } from './useNftProfileTokens';

import { useAccount } from 'wagmi';

export function useMyNftProfileTokens(): ProfileTokenResults {
  const { data: account } = useAccount();
  
  const result = useNftProfileTokens(account?.address);

  return result;
}
