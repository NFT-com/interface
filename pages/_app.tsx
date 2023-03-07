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
// import * as fbq from 'lib/fbq';
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
      {/* <Script
        id="fb-pixel"
        strategy="worker"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'js/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      /> */}
      <Script
        id="segment-script"
        strategy="worker"
        dangerouslySetInnerHTML={{ __html: segment.renderSnippet() }}
      />
      <Script strategy="afterInteractive" src="/js/pageScripts.js" />
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
