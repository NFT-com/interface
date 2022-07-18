import { generateMakerOrderTypedData,MakerOrder } from '@looksrare/sdk';
import { useCallback } from 'react';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';

export function useSignLooksrareOrder() {
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();

  const signOrder = useCallback(async (
    order: MakerOrder
  ) => {
    const { domain, value, type } = generateMakerOrderTypedData(account?.address, activeChain?.id, order);
    const signature = await signTypedDataAsync({
      domain,
      types: type,
      value
    });
    return signature;
  }, [account?.address, activeChain?.id, signTypedDataAsync]);
  return signOrder;
}