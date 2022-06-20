import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GraphQLProvider } from 'graphql/client/GraphQLProvider';
import { Doppler,getEnv, getEnvBool } from 'utils/env';

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { isMobile } from 'react-device-detect';
import ReactGA from 'react-ga';
import { rainbowDark } from 'styles/RainbowKitThemes';
import { v4 as uuid } from 'uuid';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const GOOGLE_ANALYTICS_ID: string | undefined = getEnv(Doppler.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
if (GOOGLE_ANALYTICS_ID != null) {
  const debugLogging = getEnvBool(Doppler.NEXT_PUBLIC_DEBUG_LOGGING);
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      userId: uuid(), // this is used as the sessionId
    },
    testMode: debugLogging,
    debug: debugLogging,
    titleCase: false,
  });
  ReactGA.set({
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'ethereum' in window
        ? 'mobileWeb3'
        : 'mobileRegular',
  });
} else {
  ReactGA.initialize('test', { testMode: true, debug: true });
}

const { chains, provider } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [chain.mainnet, chain.rinkeby] :
    [chain.mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/ethrpc');
        url.searchParams.set('chainId', String(chain.id));
        return {
          http: url.toString(),
        };
      }
    }),
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

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Script strategy="afterInteractive" src="/js/pageScripts.js" />
        
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
              <Component {...pageProps} key={router.pathname} />
            </GraphQLProvider>
          </AnimatePresence>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
