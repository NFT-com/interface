
import { isNullOrEmpty } from 'utils/helpers';

import { useAccount } from 'wagmi';

export function useSignedIn(): boolean {
  const { address: currentAddress } = useAccount();

  return !isNullOrEmpty(currentAddress);
}