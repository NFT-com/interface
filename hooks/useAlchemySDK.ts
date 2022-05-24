import { isSandbox } from 'utils/httpHooks';

import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export function useAlchemySDK(): AlchemyWeb3 {
  const { activeChain } = useNetwork();

  const getAPIKey = useCallback(() => {
    return isSandbox(activeChain?.id) ? process.env.ALCHEMY_RINKEBY_KEY : process.env.ALCHEMY_MAINNET_KEY;
  }, [activeChain?.id]);

  const [sdk, setSDK] = useState(createAlchemyWeb3(
    `https://eth-${isSandbox(activeChain?.id) ? 'rinkeby' : 'mainnet'}.alchemyapi.io/${getAPIKey()}`
  ));

  useEffect(() => {
    setSDK(createAlchemyWeb3(
      `https://eth-${isSandbox(activeChain?.id) ? 'rinkeby' : 'mainnet'}.alchemyapi.io/${getAPIKey()}`
    ));
  }, [activeChain?.id, getAPIKey]);

  return sdk;
}