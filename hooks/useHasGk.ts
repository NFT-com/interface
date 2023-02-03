import { isNullOrEmpty } from 'utils/helpers';

import { useOwnedGenesisKeyTokens } from './useOwnedGenesisKeyTokens';

import { useAccount } from 'wagmi';

export function useHasGk() {
  const { address: currentAddress } = useAccount();

  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGk = !isNullOrEmpty(ownedGenesisKeyTokens);

  return hasGk;
}
