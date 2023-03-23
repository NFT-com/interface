/* eslint-disable @typescript-eslint/no-empty-function */
import { SitemapField } from 'types';

import { BigNumber } from 'ethers';
import { client, gqlQueries, siteUrl, teamAuthToken } from 'lib/sitemap';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // us-east-1
};

export default async function handler(req: NextRequest) {
  // Setup variables
  let page: string | number = req.nextUrl.searchParams.get('page');
  const chainId: string = req.nextUrl.searchParams.get('chainId');
  const collection: string = req.nextUrl.searchParams.get('collection');
  try {
    page = parseInt(page);
    const sitemapFields: SitemapField[] = [];
    const siteUrlHost = `${siteUrl}app/nft`;
    const teamKey: string = req.nextUrl.searchParams.get('teamKey');

    if (teamKey !== teamAuthToken) {
      return new NextResponse('', { status: 404 });
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
    return new NextResponse(
      JSON.stringify({ sitemapFields }),
      {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=86340, stale-while-revalidate'
        }
      }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify(
        {
          error: {
            message: `An error occurred fetching the following sitemap collection page of nfts, ${JSON.stringify({ chainId, collection, page, err }, null, 2)}`
          }
        }),
      { status: 500 }
    );
  }
}

// Default export to prevent next.js errors
