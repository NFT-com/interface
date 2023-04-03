import 'styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import RootProvider from 'context';
import useAnalyticsOnRouteChange from 'hooks/useAnalyticsOnRouteChange';

import * as gtag from 'lib/gtag';
import * as segment from 'lib/segment';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import React, { ReactElement, ReactNode } from 'react';

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
      <Script id="fb-pixel-script" strategy="worker" src="/js/fbq.js" dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s) {
          if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments)
          :n.queue.push(arguments);};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
          }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1332665313901251');
          fbq('track', 'PageView');
          ` }} />
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
      <RootProvider>
        {getLayout(
          <Component {...pageProps} key={router.pathname} />
        )}
      </RootProvider>

    </>
  );
}
