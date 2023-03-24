/* eslint-disable @typescript-eslint/no-empty-function */
// pages/server-sitemap-index.xml/index.tsx
import { teamAuthToken } from 'lib/sitemap';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const res = await fetch(`${ctx.req.headers.host}/api/sitemaps/server-sitemap-index?teamKey=${teamAuthToken}`, {
    headers: {
      'Cache-Control': 's-maxage=86340, stale-while-revalidate'
    }
  });
  console.log('%c Line:11 🧀 sitemapUrls', 'color:#6ec1c2', {
    url: `${siteUrl}/api/sitemaps/server-sitemap-index?teamKey=${teamAuthToken}`,
    headers: res.headers,

    res: JSON.stringify(res, null, 2),
  });
  try {
    const results = await res.json();
    console.trace('%c Line:14 🥤 results', 'color:#fca650', results);
  } catch (e) {
    console.trace(e);
    console.error(JSON.stringify(e, null, 2));
  }

  return getServerSideSitemapIndexLegacy(ctx, []);
};

// Default export to prevent next.js errors
export default function SitemapIndex() { }
