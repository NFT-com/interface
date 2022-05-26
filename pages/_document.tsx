import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { ReactElement } from 'react';

class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="NFT.com"
          />
          <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#0C0F17" />

          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css?family=Rubik:400,500,700,900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=DM+Mono:300,400,500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet" />
          <link href='https://cdn.nft.com/StretchPro.otf' rel='stylesheet' />
          <link href='https://cdn.nft.com/BEBAS___.ttf' rel='stylesheet' />

          <script
            dangerouslySetInnerHTML={{
              __html: `window['_fs_debug'] = false;
              window['_fs_host'] = 'fullstory.com';
              window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
              window['_fs_org'] = '14EBXA';
              window['_fs_namespace'] = 'FS';
              (function(m,n,e,t,l,o,g,y){
                  if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                  g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                  o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                  y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                  g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                  g.anonymize=function(){g.identify(!!0)};
                  g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                  g.log = function(a,b){g("log",[a,b])};
                  g.consent=function(a){g("consent",!arguments.length||a)};
                  g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                  g.clearUserCookie=function(){};
                  g.setVars=function(n, p){g('setVars',[n,p]);};
                  g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                  if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                  g._v="1.3.0";
              })(window,document,window['_fs_namespace'],'script','user');`
            }}
          />
        
          <Script id='google-tag-manager' strategy='afterInteractive'>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PLBC5X8');
            `}
          </Script>

          <Script id='geq' strategy='afterInteractive'>
            {`
            !function(){var geq=window.geq=window.geq||[];if(geq.initialize) return;if (geq.invoked){if (window.console && console.error) {console.error("GE snippet included twice.");}return;}geq.invoked = true;geq.methods = ["page", "suppress", "trackOrder", "identify", "addToCart"];geq.factory = function(method){return function(){var args = Array.prototype.slice.call(arguments);args.unshift(method);geq.push(args);return geq;};};for (var i = 0; i < geq.methods.length; i++) {var key = geq.methods[i];geq[key] = geq.factory(key);}geq.load = function(key){var script = document.createElement("script");script.type = "text/javascript";script.async = true;if (location.href.includes("vge=true")) {script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js?v=" + Math.random();} else {script.src = "https://s3-us-west-2.amazonaws.com/jsstore/a/" + key + "/ge.js";}var first = document.getElementsByTagName("script")[0];first.parentNode.insertBefore(script, first);};geq.SNIPPET_VERSION = "1.5.1";
              geq.load("5N0HR7E");}();
            `}
          </Script>

          <script>geq.page()</script>

          <Script id="segment-js" strategy='afterInteractive'>
            {`
              !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5";;analytics.SNIPPET_VERSION="4.15.3";
              analytics.load("ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5");
              analytics.page();
              }}();
            `}
          </Script>

          <Script id='hotjar' strategy='afterInteractive'>
            {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:2821621,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>

          <Script id='meta-pixel' strategy='afterInteractive'>
            {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '1332665313901251');
                  fbq('track', 'PageView');
            `}
          </Script>
        </Head>
        <body>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PLBC5X8"
              height="0"
              width="0"
              style={{
                display: 'none',
                visibility:'hidden'
              }}
            />
          </noscript>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );}

}

export default MyDocument;