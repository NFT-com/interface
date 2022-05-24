
import { isNullOrEmpty } from 'utils/helpers';

import { useAccount } from 'wagmi';

export function useSignedIn(): boolean {
  const { data: account } = useAccount();

  return !isNullOrEmpty(account?.address);
}