import { OfficialCollectionNfTsOutput } from 'graphql/generated/types';
import { SitemapQueryVariables } from 'types';
import chunkArray from 'utils/chunkArray';

import { client, gqlQueries, siteUrl, teamAuthToken } from 'lib/sitemap';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // us-east-1
};

export default async function handler(req: NextRequest) {
  try {
    const sitemapUrls: string[] = [];
    const collectionNftFirstPagePromises: SitemapQueryVariables[] = [];
    const teamKey: string = req.nextUrl.searchParams.get('teamKey');

    if (teamKey !== teamAuthToken) {
      return new NextResponse('', { status: 404 });
    }

    client.setHeader('teamKey', teamKey);

    sitemapUrls.push(`${siteUrl}sitemaps/collection-sitemap.xml`);
    // console.time('server-sitemap-index');
    const officialCollections = await client.request(
      gqlQueries.officialCollections,
      {
        input: {
          offsetPageInput: {
            page: 1
          }
        }
      }).then(data => data.officialCollections);

    officialCollections && officialCollections.items.forEach(officialCollection => {
      const { chainId, contract } = officialCollection;
      const collectionNftInput = {
        input: {
          chainId,
          collectionAddress: contract,
          offsetPageInput: { page: 1 }
        }
      };

      sitemapUrls.push(`${siteUrl}sitemaps/${contract}/chain/${chainId}/page/${1}.xml`);

      collectionNftFirstPagePromises.push({
        chainId,
        contract,
        document: gqlQueries.collectionNfts,
        variables: collectionNftInput
      });
    });

    const batchedRequests = chunkArray(collectionNftFirstPagePromises, 100);
    const results = await Promise.all(batchedRequests.map((batchedRequest) =>
      client.batchRequests<{ data: { officialCollectionNFTs: OfficialCollectionNfTsOutput } }[]>(batchedRequest).then(
        data => data.map((pageResult, index) => ({
          ...pageResult?.data.officialCollectionNFTs,
          chainId: batchedRequest[index].chainId,
          contract: batchedRequest[index].contract,
        }))
      )
    ));

    results && results.flat(2).forEach((result) => {
      if (result) {
        const { contract, chainId, pageCount } = result;
        if (pageCount > 1) {
          for (let pgIndex = 0; pgIndex < pageCount - 1; pgIndex += 1) {
            sitemapUrls.push(`${siteUrl}sitemaps/${contract}/chain/${chainId}/page/${pgIndex + 2}.xml`);
          }
        }
      }
    });

    return new NextResponse(
      JSON.stringify({ sitemapUrls }),
      {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=86340, stale-while-revalidate'
        }
      }
    );
  } catch (err) {
    console.trace(err);
    return new NextResponse(
      JSON.stringify(
        {
          error: {
            message: `An error occurred, ${err}`
          }
        }), { status: 500 });
  }
}