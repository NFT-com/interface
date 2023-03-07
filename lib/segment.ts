import * as snippet from '@segment/snippet';

// TODO: Set proper Doppler env key & implement proper NODE_ENV for deployment environments
const DEFAULT_WRITE_KEY = 'ey8FEiTC7Von8zKLqIe1ju6rGLzeG4A5';

/**
 * Renders the snippet for the page.
 * @returns {string} The snippet for the page.
 */
export const renderSnippet = () => {
  const options = {
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,
    /**
    * Note: page option only covers SSR tracking.
    * Page.js is used to track other events using `window.analytics.page()`
    */
    page: true
  };

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(options);
  }

  return snippet.min(options);
};

/**
 * Send a pageview to Google Analytics.
 * @param {string} url - the URL of the pageview.
 * @returns None
 */
export const pageview = (url) => {
  window.analytics.page(url);
};
