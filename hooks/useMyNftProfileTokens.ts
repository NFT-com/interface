import { useAccount } from 'wagmi';
import { ProfileTokenResults, useNftProfileTokens } from './useNftProfileTokens';


export function useMyNftProfileTokens(): ProfileTokenResults {
  const { data: account } = useAccount();
  
  const result = useNftProfileTokens(account?.address);

  return result;
}
