import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GraphQLProvider } from 'graphql/client/GraphQLProvider';

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import { AnimatePresence } from 'framer-motion';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { rainbowDark } from 'styles/RainbowKitThemes';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY;
const infuraId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const { chains, provider } = configureChains(
  process.env.NEXT_PUBLIC_ENV !== 'PRODUCTION' ?
    [chain.mainnet, chain.rinkeby] :
    [chain.mainnet],
  [
    alchemyProvider({ alchemyId }),
    infuraProvider({ infuraId }),
    publicProvider()
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

export default function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        appInfo={{
          appName: 'NFT.com',
          learnMoreUrl: 'https://docs.nft.com/',
        }}
        theme={rainbowDark}
        chains={chains}>
        <AnimatePresence exitBeforeEnter>
          <GraphQLProvider>
            {getLayout(<Component {...pageProps} key={router.pathname} />)}
          </GraphQLProvider>
        </AnimatePresence>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
