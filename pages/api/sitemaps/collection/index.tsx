import { SitemapField } from 'types';

import { client, gqlQueries, siteUrl, teamAuthToken } from 'lib/sitemap';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // us-east-1
};

export default async function handler(req: NextRequest) {
  try {
    // Setup variables
    const sitemapFields: SitemapField[] = [];
    const siteUrlHost = `${siteUrl}app/collection`;
    const teamKey: string = req.nextUrl.searchParams.get('teamKey');

    if (teamKey !== teamAuthToken) {
      return new NextResponse('', { status: 404 });
    }

    client.setHeader('teamKey', teamKey);

    const officialCollections = await client.request(gqlQueries.officialCollections, { input: { offsetPageInput: { page: 1 } } }).then(data => data.officialCollections).catch((err) => console.error(err));

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
      JSON.stringify({ error: { message: `An error occurred, ${err}` } }),
      { status: 500 }
    );
  }
}
