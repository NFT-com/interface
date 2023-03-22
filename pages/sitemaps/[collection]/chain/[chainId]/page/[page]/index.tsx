/* eslint-disable @typescript-eslint/no-empty-function */
import { gql, GraphQLClient } from 'graphql-request';
import { SitemapField } from 'types';
import { getAPIURL } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const { params: { chainId, collection, page: pageCtx } } = ctx;
  const page = parseInt((pageCtx as string).replace('.xml', ''));
  const sitemapFields: SitemapField[] = [];
  const siteUrlHost = `${siteUrl}/app/nft`;

  const client = new GraphQLClient(getAPIURL());

  client.setHeader('teamKey', process.env.TEAM_AUTH_TOKEN);
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const gqlQueries = {
    collectionNfts: gql`
    query OfficialCollectionNFTs($input: OfficialCollectionNFTsInput!) {
      officialCollectionNFTs(input: $input) {
        items {
          tokenId
          updatedAt
        }
        pageCount
        totalItems
      }
    }
  `
  };

  const officialCollectionNfts = await client.request(
    gqlQueries.collectionNfts,
    {
      input: {
        chainId,
        collectionAddress: collection,
        offsetPageInput: { page }
      }
    }).then(data => data.officialCollectionNFTs).catch((err) => console.error(err));

  if (officialCollectionNfts && officialCollectionNfts?.items) {
    officialCollectionNfts.items.forEach(({ tokenId, updatedAt }, i) => {
      sitemapFields.push({
        loc: `${siteUrlHost}/${collection}/${BigNumber.from(tokenId).toString()}`,
        lastmod: updatedAt,
        priority: 0.7,
        changefreq: 'daily'
      });
    });
  }
  return getServerSideSitemapLegacy(ctx, sitemapFields);
};

// Default export to prevent next.js errors
export default function CollectionNftsPageSitemap() {}
