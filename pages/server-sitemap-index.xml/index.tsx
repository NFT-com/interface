/* eslint-disable @typescript-eslint/no-empty-function */
// pages/server-sitemap-index.xml/index.tsx
import { gql, GraphQLClient } from 'graphql-request';
import { getAPIURL } from 'utils/helpers';

import { GetServerSideProps } from 'next';
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Setup variables
  const sitemapUrls: string[] = [];
  const collectionNftFirstPagePromises = [];
  const siteUrlHost = 'https://nft.com';

  const client = new GraphQLClient(getAPIURL());

  client.setHeader('teamKey', process.env.TEAM_AUTH_TOKEN);
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const gqlQueries = {
    officialCollections: gql`
      query ExampleQuery($input: OfficialCollectionsInput!) {
        officialCollections(input: $input) {
          items {
            contract
            name
            chainId
          }
          pageCount
          totalItems
        }
      }
    `,
    collectionNfts: gql`
      query OfficialCollectionNFTs($input: OfficialCollectionNFTsInput!) {
        officialCollectionNFTs(input: $input) {
          items {
            tokenId
          }
          pageCount
          totalItems
        }
      }
    `
  };

  sitemapUrls.push(`${siteUrlHost}/sitemaps/collection-sitemap.xml`);

  const officialCollections = await client.request( gqlQueries.officialCollections, { input: { offsetPageInput: { page: 1 } } }).then(data => data.officialCollections).catch((err) => console.error(err));

  if (officialCollections && officialCollections?.items) {
    officialCollections && officialCollections.items.map(officialCollection => {
      const { chainId, contract } = officialCollection;
      const collectionNftInput = {
        input: {
          chainId,
          collectionAddress: contract,
          offsetPageInput: { page: 1 }
        }
      };

      sitemapUrls.push(`${siteUrlHost}/sitemaps/${contract}/chain/${chainId}/page/${1}.xml`);

      collectionNftFirstPagePromises.push(client.request(gqlQueries.collectionNfts, collectionNftInput).then(data => ({ ...data.officialCollectionNFTs, contract, chainId })));
    });

    const firstPageResults = await Promise.all(collectionNftFirstPagePromises);

    firstPageResults.forEach(({ contract, chainId, pageCount }) => {
      if (pageCount > 1) {
        for (let pgIndex = 0; pgIndex < pageCount - 1; pgIndex+=1) {
          sitemapUrls.push(`${siteUrlHost}/sitemaps/${contract}/chain/${chainId}/page/${pgIndex + 2}.xml`);
        }
      }
    });
  }

  return getServerSideSitemapIndexLegacy(ctx, sitemapUrls);
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
