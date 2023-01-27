import { Doppler, getEnv } from 'utils/env';

import { useNetwork } from 'wagmi';

export function useDefaultChainId() {
  const { chain } = useNetwork();
  return String(getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID) ?? chain?.id);
}