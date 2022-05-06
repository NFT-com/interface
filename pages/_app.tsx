import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getEnv, Secret } from 'utils/env';

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
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
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export default MyApp;
