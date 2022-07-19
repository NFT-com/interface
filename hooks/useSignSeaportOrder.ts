import { getTypedDataDomain } from 'utils/seaportHelpers';

import { SignTypedDataArgs } from '@wagmi/core';
import { useCallback } from 'react';
import { EIP_712_ORDER_TYPE, SeaportOrderComponents, SeaportOrderParameters } from 'types';
import { useNetwork, useSignTypedData } from 'wagmi';

export function useSignSeaportOrder() {
  const { activeChain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();

  const signOrder = useCallback(async (
    orderParameters: SeaportOrderParameters,
    counter: string,
  ) => {
    const data: SignTypedDataArgs = {
      domain: getTypedDataDomain(activeChain?.id ?? 1),
      types: EIP_712_ORDER_TYPE,
      value: {
        ...orderParameters,
        counter
      } as SeaportOrderComponents,
    };

    const signature: string = await signTypedDataAsync(data)
      .catch(() => {
        // user rejected signature request
        return null;
      });
    if (signature == null) {
      return '';
    }
    return signature;
  }, [activeChain, signTypedDataAsync]);

  return signOrder;
}