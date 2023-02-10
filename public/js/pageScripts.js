/* eslint-disable no-undef */

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({ 'gtm.start':
          new Date().getTime(),
event:'gtm.js' });var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PLBC5X8');

!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error('Segment snippet included twice.');else{analytics.invoked=!0;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','reset','group','track','ready','alias','debug','page','once','off','on','addSourceMiddleware','addIntegrationMiddleware','setAnonymousId','addDestinationMiddleware'];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics;};};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key);}analytics.load=function(key,e){var t=document.createElement('script');t.type='text/javascript';t.async=!0;t.src='https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';var n=document.getElementsByTagName('script')[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e;};analytics._writeKey='ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5';analytics.SNIPPET_VERSION='4.15.3';
  analytics.load('ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5');
  analytics.page();
}}();

// (function(h,o,t,j,a,r){
//   h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments);};
//   h._hjSettings={ hjid:2821621,hjsv:6,hjdebug:true };
//   a=o.getElementsByTagName('head')[0];
//   r=o.createElement('script');r.async=1;
//   r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
//   a.appendChild(r);
// })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

!function(f,b,e,v,n,t,s) {
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