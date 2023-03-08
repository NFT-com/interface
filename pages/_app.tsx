import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import CustomAvatar from 'components/elements/CustomAvatar';
import Disclaimer from 'components/elements/Disclaimer';
import { NFTListingsContextProvider } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchaseContextProvider } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationContextProvider } from 'components/modules/Notifications/NotificationContext';
import { GraphQLProvider } from 'graphql/client/GraphQLProvider';
import useAnalyticsOnRouteChange from 'hooks/useAnalyticsOnRouteChange';
import { Doppler, getEnv } from 'utils/env';

import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { AnimatePresence } from 'framer-motion';
import * as gtag from 'lib/gtag';
import * as segment from 'lib/segment';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import { ReactElement, ReactNode, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { rainbowLight } from 'styles/RainbowKitThemes';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const { chains, provider } = useMemo(() => {
    return configureChains(
      getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION'
        ? [mainnet, goerli]
        : [mainnet],
      [
        jsonRpcProvider({
          rpc: (chain) => {
            const url = new URL(
              getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/ethrpc'
            );
            url.searchParams.set('chainId', chain?.id.toString());
            return {
              http: url.toString(),
            };
          },
        }),
      ]
    );
  }, []);

  const connectors = useMemo(() => {
    return connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          metaMaskWallet({ chains, shimDisconnect: true }),
          // safeWallet({ chains }),
          rainbowWallet({ chains }),
        ],
      },
      {
        groupName: 'Others',
        wallets: [
          walletConnectWallet({ chains }),
          coinbaseWallet({ chains, appName: 'NFT.com' }),
          trustWallet({ chains }),
          ledgerWallet({ chains }),
          argentWallet({ chains }),
        ],
      },
    ]);
  }, [chains]);

  const wagmiClient = useMemo(() => {
    return createClient({
      autoConnect: true,
      connectors,
      provider,
    });
  }, [connectors, provider]);

  useAnalyticsOnRouteChange();

  return (
    <>
      <Head>
        <title>NFT.com</title>
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}

            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
            });
        `,
          }}
        />
      </Head>
      <Script
        strategy="worker"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="segment-script"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error('Segment snippet included twice.');else{analytics.invoked=!0;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','reset','group','track','ready','alias','debug','page','once','off','on','addSourceMiddleware','addIntegrationMiddleware','setAnonymousId','addDestinationMiddleware'];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics;};};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key);}analytics.load=function(key,e){var t=document.createElement('script');t.type='text/javascript';t.async=!0;t.src='https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';var n=document.getElementsByTagName('script')[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e;};analytics._writeKey='${segment.SEGMENT_API_KEY}';analytics.SNIPPET_VERSION='4.15.3';
            analytics.load('${segment.SEGMENT_API_KEY}');
            analytics.page();
            }}();
          `
        }}
      />
      <Script strategy="afterInteractive" src="/js/fbq.js" />
      <DefaultSeo
        title="NFT.com | The Social NFT Marketplace"
        description="Join NFT.com to display, trade, and engage with your NFTs."
        openGraph={{
          url: 'https://www.nft.com',
          title: 'NFT.com | The Social NFT Marketplace',
          description:
            'Join NFT.com to display, trade, and engage with your NFTs.',
          site_name: 'NFT.com',
          images: [
            {
              url: 'https://www.nft.com/site-meta-image.png',
              width: 1200,
              height: 627,
              alt: 'NFT.com | The Social NFT Marketplace',
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={{
            appName: 'NFT.com',
            learnMoreUrl: 'https://docs.nft.com/what-is-a-wallet',
            disclaimer: Disclaimer,
          }}
          theme={rainbowLight}
          chains={chains}
          initialChain={
            getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' &&
            getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'STAGING'
              ? goerli
              : mainnet
          }
          avatar={CustomAvatar}
        >
          <AnimatePresence exitBeforeEnter>
            <GraphQLProvider>
              <DndProvider backend={HTML5Backend}>
                <NotificationContextProvider>
                  <NFTPurchaseContextProvider>
                    <NFTListingsContextProvider>
                      {getLayout(
                        <Component {...pageProps} key={router.pathname} />
                      )}
                    </NFTListingsContextProvider>
                  </NFTPurchaseContextProvider>
                </NotificationContextProvider>
              </DndProvider>
            </GraphQLProvider>
          </AnimatePresence>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
