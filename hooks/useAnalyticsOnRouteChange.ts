import * as gtag from 'lib/gtag';
import * as segment from 'lib/segment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Hook that engages 3rd party analytics scripts to track page views on route changes.
 * @returns None
 */
export default function useAnalyticsOnRouteChange() {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
      segment.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
