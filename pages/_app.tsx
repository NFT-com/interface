import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import LoggedInIdenticon from 'components/elements/LoggedInIdenticon';
import { NFTListingsContextProvider } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchaseContextProvider } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationContextProvider } from 'components/modules/Notifications/NotificationContext';
import { GraphQLProvider } from 'graphql/client/GraphQLProvider';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { getBaseUrl, getChainIdString } from 'utils/helpers';

import {
  AvatarComponent,
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
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';
import { AnimatePresence } from 'framer-motion';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import { ReactElement, ReactNode, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactGA from 'react-ga';
import { rainbowLight } from 'styles/RainbowKitThemes';
import { v4 as uuid } from 'uuid';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { safeWallet } from 'wallets/SafeWallet';

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

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const { chains, provider } = useMemo(() => {
    return configureChains(
      getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
        [mainnet, goerli] :
        [mainnet],
      [
        jsonRpcProvider({
          rpc: (chain) => {
            const url = new URL(getBaseUrl('/') + 'api/ethrpc');
            url.searchParams.set('chainId', getChainIdString(chain?.id));
            return {
              http: url.toString(),
            };
          }
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
          argentWallet({ chains })
        ],
      },
    ]);
  }, [chains]);

  const wagmiClient = useMemo(() => {
    return createClient({
      autoConnect: true,
      connectors,
      provider
    });
  }, [connectors, provider]);

  const CustomAvatar: AvatarComponent = () => {
    return <LoggedInIdenticon />;
  };

  return (
    <>
      <Head>
        <title>NFT.com</title>
      </Head>
      <Script strategy="afterInteractive" src="/js/pageScripts.js" />
      <DefaultSeo
        title='NFT.com | The Social NFT Marketplace'
        description='Join NFT.com to display, trade, and engage with your NFTs.'
        openGraph={{
          url: 'https://www.nft.com',
          title: 'NFT.com | The Social NFT Marketplace',
          description: 'Join NFT.com to display, trade, and engage with your NFTs.',
          site_name: 'NFT.com',
          images: [
            {
              url: 'https://www.nft.com/site-meta-image.png',
              width: 1200,
              height: 627,
              alt: 'NFT.com | The Social NFT Marketplace',
              type: 'image/png',
            }
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
          }}
          theme={rainbowLight}
          chains={chains}
          initialChain={getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' && getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'STAGING' ? goerli : mainnet}
          avatar={CustomAvatar}
        >
          <AnimatePresence exitBeforeEnter>
            <GraphQLProvider>
              <DndProvider backend={HTML5Backend}>
                <NotificationContextProvider>
                  <NFTPurchaseContextProvider>
                    <NFTListingsContextProvider>
                      {getLayout(<Component {...pageProps} key={router.pathname} />)}
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
