import { gql, GraphQLClient } from 'graphql-request';

export { siteUrl } from 'next-sitemap.config';

export const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
  cache: 'default',
  headers: {
    'Cache-Control': 's-maxage=86340, stale-while-revalidate',
    'Connection': 'keep-alive',
    'Keep-Alive': 'timeout=120'
  }
});

export const teamAuthToken = process.env.TEAM_AUTH_TOKEN;

// GQL queries to source sitemap data
export const gqlQueries = {
  officialCollections: gql`
    query OfficialCollections($input: OfficialCollectionsInput!) {
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
