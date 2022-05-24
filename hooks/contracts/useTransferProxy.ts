import { AssetClass, Maybe } from 'graphql/generated/types';
import { encodeAssetClass } from 'utils/signatureUtils';

import { useAllContracts } from './useAllContracts';

import { useEffect, useState } from 'react';

export function useTransferProxy(assetClass: AssetClass): Maybe<string> {
  const { marketplace } = useAllContracts();
  const [proxy, setProxy] = useState<Maybe<string>>(null);
  useEffect(() => {
    (async () => {
      const proxyAddress = await marketplace.proxies(encodeAssetClass(assetClass));
      setProxy(proxyAddress);
    })();
  }, [assetClass, marketplace]);
  return proxy;
}