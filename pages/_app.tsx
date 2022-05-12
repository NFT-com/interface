import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GraphQLProvider } from 'graphql/client/GraphQLProvider';
import { getEnv, Secret } from 'utils/getEnv';

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { UserContext, useUserContextValue } from 'context/UserContext';
import type { AppProps } from 'next/app';
import { chain, createClient, WagmiProvider } from 'wagmi';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [
    apiProvider.alchemy(getEnv(Secret.REACT_APP_ALCHEMY_MAINNET_KEY)),
    apiProvider.alchemy(getEnv(Secret.REACT_APP_ALCHEMY_RINKEBY_KEY)),
    apiProvider.infura(getEnv(Secret.REACT_APP_INFURA_PROJECT_ID)),
    apiProvider.fallback()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'NFT.com',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function MyApp({ Component, pageProps }: AppProps) {
  const userContextValue = useUserContextValue();
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <GraphQLProvider>
          <UserContext.Provider value={userContextValue}>
            <Component {...pageProps} />
          </UserContext.Provider>
        </GraphQLProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp;
