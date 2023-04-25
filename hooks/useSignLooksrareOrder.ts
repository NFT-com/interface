import { Provider } from '@ethersproject/providers';
import { ChainId, LooksRare, Maker } from '@looksrare/sdk-v2';
import { useCallback } from 'react';

export function useSignLooksrareOrder(signer: any, provider: Provider) {
  const signOrder = useCallback(async (
    order: Maker
  ) => {
    const lr = new LooksRare(ChainId.MAINNET, provider, signer);
    const signature = await lr.signMakerOrder(order);
    return signature;
  }, [provider, signer]);
  return signOrder;
}