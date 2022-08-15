import { generateMakerOrderTypedData,MakerOrder } from '@looksrare/sdk';
import { useCallback } from 'react';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';

export function useSignLooksrareOrder() {
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();

  const signOrder = useCallback(async (
    order: MakerOrder
  ) => {
    const { domain, value, type } = generateMakerOrderTypedData(currentAddress, chain?.id, order);
    const signature = await signTypedDataAsync({
      domain: {
        ...domain,
        chainId: chain?.id,
      },
      types: type,
      value
    });
    return signature;
  }, [currentAddress, chain?.id, signTypedDataAsync]);
  return signOrder;
}