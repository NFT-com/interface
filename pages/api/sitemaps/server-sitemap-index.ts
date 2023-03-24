import { OfficialCollectionNfTsOutput } from 'graphql/generated/types';
import { SitemapQueryVariables } from 'types';
import chunkArray from 'utils/chunkArray';

import { client, gqlQueries, teamAuthToken } from 'lib/sitemap';
// import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   runtime: 'edge',
//   regions: ['iad1'], // us-east-1
// };

// export default async function handler(req: NextRequest) {
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemapUrls: string[] = [];
    const collectionNftFirstPagePromises: SitemapQueryVariables[] = [];
    // const teamKey: string = req.nextUrl.searchParams.get('teamKey');
    const { teamKey } = req.query;

    if (teamKey !== teamAuthToken) {
      // return new NextResponse('', { status: 404 });
      return res.status(404).end();
    }

    client.setHeader('teamKey', teamKey);

    sitemapUrls.push(`https://${req.headers.host}/sitemaps/collection-sitemap.xml`);
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

      sitemapUrls.push(`https://${req.headers.host}/sitemaps/${contract}/chain/${chainId}/page/${1}.xml`);

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
            sitemapUrls.push(`${req.headers.host}/sitemaps/${contract}/chain/${chainId}/page/${pgIndex + 2}.xml`);
          }
        }
      }
    });

    // return new NextResponse(
    //   JSON.stringify({ sitemapUrls }),
    //   {
    //     status: 200,
    //     headers: {
    //       'Cache-Control': 's-maxage=86340, stale-while-revalidate'
    //     }
    //   }
    // );
    res.setHeader('Cache-Control', 's-maxage=86340, stale-while-revalidate');
    return res.status(200).json({ sitemapUrls });
  } catch (err) {
    // console.trace(err);
    // return new NextResponse(
    //   JSON.stringify(
    //     {
    //       error: {
    //         message: `An error occurred fetching the server sitemap index, ${JSON.stringify(err, null, 2)}`
    //       }
    //     }), { status: 500 });
    return res.status(500).json({
      error: {
        message: `An error occurred fetching the server sitemap index, ${JSON.stringify(err, null, 2)}`
      }
    });
  }
}
