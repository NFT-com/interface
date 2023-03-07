import { Doppler, getEnv } from 'utils/env';
import { isDev } from 'utils/isEnv';

import * as snippet from '@segment/snippet';

const SEGMENT_API_KEY: string | undefined = getEnv(Doppler.NEXT_PUBLIC_SEGMENT_API_KEY);

/**
 * Renders the segment snippet for the page.
 * @returns {string} The snippet for the page.
 */
export const renderSnippet = () => {
  const options = {
    apiKey: SEGMENT_API_KEY,
    /**
     * Note: page option only covers SSR tracking.
     * Page.js is used to track other events using `window.analytics.page()`
     */
    page: true,
  };

  if (isDev) {
    return snippet.max(options);
  }

  return snippet.min(options);
};

/**
 * Send a pageview to Segment Analytics.
 * @param {string} url - the URL of the pageview.
 * @returns None
 */
export const pageview = (url) => {
  window.analytics.page(url);
};
