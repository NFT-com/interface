import { ProfileTokenResults, useNftProfileTokens } from './useNftProfileTokens';

import { useAccount } from 'wagmi';

export function useMyNftProfileTokens(): ProfileTokenResults {
  const { data: account } = useAccount();
  
  // TODO: UNDO THIS CHANGE BEFORE LANDING
  // const result = useNftProfileTokens(account?.address);
  const result = useNftProfileTokens('0xf14C166CEFEA0e53Af3B70BB38850ECf4B5A80A5');

  return result;
}
