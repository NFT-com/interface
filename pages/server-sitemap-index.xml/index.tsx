/* eslint-disable @typescript-eslint/no-empty-function */
// pages/server-sitemap-index.xml/index.tsx
import { teamAuthToken } from 'lib/sitemap';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const { sitemapUrls } = await fetch(`https://${ctx.req.headers.host}/api/sitemaps/server-sitemap-index?teamKey=${teamAuthToken}`, {
    headers: {
      'Cache-Control': 's-maxage=86340, stale-while-revalidate'
    }
  }).then(res => res.json());

  return getServerSideSitemapIndexLegacy(ctx, sitemapUrls || []);
};

// Default export to prevent next.js errors
export default function SitemapIndex() { }
