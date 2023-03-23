/* eslint-disable @typescript-eslint/no-empty-function */
import { teamAuthToken } from 'lib/sitemap';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { sitemapFields } = await fetch(`${siteUrl}/api/sitemaps/collection?teamKey=${teamAuthToken}`).then((res) => res.json());

  return getServerSideSitemapLegacy(ctx, sitemapFields || []);
};

// Default export to prevent next.js errors
export default function CollectionSitemap() { }
