import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GraphQLProvider } from 'graphql/client/GraphQLProvider';

import {
  apiProvider,
  configureChains,
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import { AnimatePresence } from 'framer-motion';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { rainbowDark } from 'styles/RainbowKitThemes';
import { chain, createClient, WagmiProvider } from 'wagmi';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const { chains, provider } = configureChains(
  process.env.NEXT_PUBLIC_ENV !== 'PRODUCTION' ?
    [chain.mainnet, chain.rinkeby] :
    [chain.mainnet],
  [
    apiProvider.alchemy(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY),
    apiProvider.infura(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
    apiProvider.fallback()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains, shimDisconnect: true }),
      wallet.rainbow({ chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      wallet.walletConnect({ chains }),
      wallet.coinbase({ chains, appName: 'NFT.com' }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
      wallet.argent({ chains })
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider
        appInfo={{
          appName: 'NFT.com',
          learnMoreUrl: 'https://docs.nft.com/',
        }}
        theme={rainbowDark}
        chains={chains}>
        <GraphQLProvider>
          <AnimatePresence>
            {getLayout(<Component {...pageProps} />)}
          </AnimatePresence>
        </GraphQLProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
