import { OfficialCollectionNfTsOutput } from 'graphql/generated/types';
import { SitemapQueryVariables } from 'types';
import chunkArray from 'utils/chunkArray';

import { client, getSitemapUrl, gqlQueries, teamAuthToken } from 'lib/sitemap';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Serverless API route for querying server sitemap index.
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @returns {{sitemapUrls: string[]}} res - 200 response with array of sitemap fields
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sitemapUrls: string[] = [];
    const collectionNftFirstPagePromises: SitemapQueryVariables[] = [];
    const { teamKey } = req.query;
    const sitemapHostUrl = getSitemapUrl({
      host: req.headers.host,
      path: '/sitemaps'
    });

    // Verify api has proper auth token
    if (teamKey !== teamAuthToken) {
      return res.status(404).end();
    }

    client.setHeader('teamKey', teamKey);

    sitemapUrls.push(
      `${sitemapHostUrl}/collection-sitemap.xml`,
      `${sitemapHostUrl}/article-sitemap.xml`
    );
    const officialCollections = await client.request(
      gqlQueries.officialCollections,
      {
        input: {
          offsetPageInput: {
            page: 1
          }
        }
      }).then(data => data.officialCollections);

    officialCollections && officialCollections.items.forEach((officialCollection, index) => {
      const { chainId, contract, slug } = officialCollection;
      const collectionNftInput = {
        input: {
          chainId,
          collectionAddress: contract,
          offsetPageInput: { page: 1 }
        }
      };

      sitemapUrls.push(`${sitemapHostUrl}/collection/official/${slug}/chain/${chainId}/page/${1}.xml`);

      collectionNftFirstPagePromises.push({
        chainId,
        contract,
        slug,
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
          slug: batchedRequest[index].slug,
        }))
      )
    ));

    results && results.flat(2).forEach((result) => {
      if (result) {
        const { chainId, slug, pageCount } = result;
        if (pageCount > 1) {
          for (let pgIndex = 0; pgIndex < pageCount - 1; pgIndex += 1) {
            sitemapUrls.push(`${sitemapHostUrl}/collection/official/${slug}/chain/${chainId}/page/${pgIndex + 2}.xml`);
          }
        }
      }
    });

    // Cache API response for 24hrs
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

    return res.status(200).json({ sitemapUrls });
  } catch (err) {
    console.error(err?.message);
    return res.status(500).json({
      error: {
        message: `An error occurred fetching the server sitemap index, ${err?.message}`
      }
    });
  }
}
