/* eslint-disable @typescript-eslint/no-empty-function */
import { gql, GraphQLClient } from 'graphql-request';
import { SitemapField } from 'types';
import { getAPIURL } from 'utils/helpers';

import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';
import { siteUrl } from 'next-sitemap.config';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const sitemapFields: SitemapField[] = [];
  const siteUrlHost = `${siteUrl}/app/collection`;

  const client = new GraphQLClient(getAPIURL());

  client.setHeader('teamKey', process.env.TEAM_AUTH_TOKEN);
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const gqlQueries = {
    officialCollections: gql`
      query ExampleQuery($input: OfficialCollectionsInput!) {
        officialCollections(input: $input) {
          items {
            name
            contract
            chainId
            updatedAt
          }
          pageCount
          totalItems
        }
      }
    `,
  };

  const officialCollections = await client.request( gqlQueries.officialCollections, { input: { offsetPageInput: { page: 1 } } }).then(data => data.officialCollections).catch((err) => console.error(err));

  if (officialCollections && officialCollections?.items) {
    officialCollections.items.forEach(({ contract, updatedAt }) => {
      sitemapFields.push({
        loc: `${siteUrlHost}/${contract}`,
        lastmod: updatedAt,
        priority: 0.7,
        changefreq: 'daily'
      });
    });
  }
  return getServerSideSitemapLegacy(ctx, sitemapFields);
};

// Default export to prevent next.js errors
export default function CollectionSitemap() {}
