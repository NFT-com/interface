/* eslint-disable @typescript-eslint/no-empty-function */
import { SitemapField } from 'types';

import { BigNumber } from 'ethers';
import { client, gqlQueries, siteUrl, teamAuthToken } from 'lib/sitemap';
// import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   runtime: 'edge',
//   regions: ['iad1'], // us-east-1
// };

// export default async function handler(req: NextRequest) {
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Setup variables
  // let page: string | number = req.nextUrl.searchParams.get('page');
  // const chainId: string = req.nextUrl.searchParams.get('chainId');
  // const collection: string = req.nextUrl.searchParams.get('collection');
  // eslint-disable-next-line prefer-const
  const { chainId, collection, page: pageCtx, teamKey } = req.query;
  try {
    // page = parseInt(page);
    const page = parseInt(pageCtx as string);
    const sitemapFields: SitemapField[] = [];
    const siteUrlHost = `${siteUrl}app/nft`;
    // const teamKey: string = req.nextUrl.searchParams.get('teamKey');

    if (teamKey !== teamAuthToken) {
      // return new NextResponse('', { status: 404 });
      return res.status(404).end();
    }

    client.setHeader('teamKey', teamKey);

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
      officialCollectionNfts.items.forEach(({ tokenId, updatedAt }) => {
        sitemapFields.push({
          loc: `${siteUrlHost}/${collection}/${BigNumber.from(tokenId).toString()}`,
          lastmod: updatedAt,
          priority: 0.7,
          changefreq: 'daily'
        });
      });
    }
    res.setHeader('Cache-Control', 's-maxage=86340, stale-while-revalidate');
    return res.status(200).json({ sitemapFields });
    // return new NextResponse(
    //   JSON.stringify({ sitemapFields }),
    //   {
    //     status: 200,
    //     headers: {
    //       'Cache-Control': 's-maxage=86340, stale-while-revalidate'
    //     }
    //   }
    // );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: {
        message: `An error occurred fetching the following sitemap collection page of nfts, ${JSON.stringify({ chainId, collection, page: pageCtx, err }, null, 2)}`
      }
    });
    // return new NextResponse(
    //   JSON.stringify(
    //     {
    //       error: {
    //         message: `An error occurred fetching the following sitemap collection page of nfts, ${JSON.stringify({ chainId, collection, page, err }, null, 2)}`
    //       }
    //     }),
    //   { status: 500 }
    // );
  }
}

// Default export to prevent next.js errors
