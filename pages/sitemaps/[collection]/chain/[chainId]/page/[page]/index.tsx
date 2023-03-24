/* eslint-disable @typescript-eslint/no-empty-function */
import { teamAuthToken } from 'lib/sitemap';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const { params: { chainId, collection, page: pageCtx } } = ctx;
  const page = parseInt((pageCtx as string).replace('.xml', ''));

  const { sitemapFields } = await fetch(`https://${ctx.req.headers.host}/api/sitemaps/collection/nft?teamKey=${teamAuthToken}&chainId=${chainId}&collection=${collection}&page=${page}`).then((res) => res.json());

  return getServerSideSitemapLegacy(ctx, sitemapFields || []);
};

// Default export to prevent next.js errors
export default function CollectionNftsPageSitemap() { }
