import { Doppler, getEnv } from 'utils/env';

export const SEGMENT_API_KEY: string | undefined = getEnv(Doppler.NEXT_PUBLIC_SEGMENT_API_KEY);

/**
 * Send a pageview to Segment Analytics.
 * @param {string} url - the URL of the pageview.
 * @returns None
 */
export const pageview = (url) => {
  window.analytics.page(url);
};
