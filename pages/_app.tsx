import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GraphQLProvider } from 'graphql/client/GraphQLProvider';

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { rainbowDark } from 'styles/RainbowKitThemes';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const alchemyId = process.env.ALCHEMY_MAINNET_KEY;
const infuraId = process.env.INFURA_PROJECT_ID;

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

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Script id='google-tag-manager' strategy='afterInteractive'>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PLBC5X8');
        `}
      </Script>

      <Script id="segment-js" strategy='afterInteractive'>
        {`
          !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5";;analytics.SNIPPET_VERSION="4.15.3";
          analytics.load("ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5");
          analytics.page();
          }}();
        `}
      </Script>
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
