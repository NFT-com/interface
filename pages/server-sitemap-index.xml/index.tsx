/* eslint-disable @typescript-eslint/no-empty-function */
// pages/server-sitemap-index.xml/index.tsx
import { teamAuthToken } from 'lib/sitemap';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const { sitemapUrls } = await fetch(`${siteUrl}/api/sitemaps/server-sitemap-index?teamKey=${teamAuthToken}`).then((res) => res.json());
  console.log('%c Line:11 🧀 sitemapUrls', 'color:#6ec1c2', sitemapUrls);

  return getServerSideSitemapIndexLegacy(ctx, sitemapUrls || []);
};

// Default export to prevent next.js errors
export default function SitemapIndex() { }
