import { X2Y2_ORDER_COMPONENTS, X2Y2_ORDER_TYPE } from 'types';

import { SignTypedDataArgs } from '@wagmi/core';
import { X2Y2Order } from '@x2y2-io/sdk/dist/types';
import { useCallback } from 'react';
import { useNetwork, useSigner, useSignTypedData } from 'wagmi';

export function useSignX2Y2Order() {
  const { chain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const signer = useSigner();
  
  const signOrder = useCallback(async (
    order: X2Y2Order,
  ) => {
    if (!signer) {
      console.log('No Signer connected');
      return '';
    }
    const data: SignTypedDataArgs = {
      domain: {
        name: 'X2Y2',
        chainId: chain?.id,
        version: '1'
      },
      types: X2Y2_ORDER_TYPE,
      value: {
        salt: order.salt,
        user: order.user,
        network: order.network,
        intent: order.intent,
        delegateType: order.delegateType,
        deadline: order.deadline,
        currency: order.currency,
        dataMask: order.dataMask,
        itemCount: order.items.length,
        items: order.items
      } as X2Y2_ORDER_COMPONENTS,
    };

    const signature: string = await signTypedDataAsync(data)
      .catch(() => {
        return null;
      });
    if (signature == null) {
      return '';
    }
    return signature;
  }, [chain?.id, signTypedDataAsync, signer]);

  return signOrder;
}

