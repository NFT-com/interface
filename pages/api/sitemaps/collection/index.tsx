/* eslint-disable @typescript-eslint/no-empty-function */
import { SitemapField } from 'types';

import { client, gqlQueries, siteUrl, teamAuthToken } from 'lib/sitemap';
// import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//   runtime: 'edge',
//   regions: ['iad1'], // us-east-1
// };

// export default async function handler(req: NextRequest) {
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Setup variables
    const { teamKey } = req.query;
    const sitemapFields: SitemapField[] = [];
    const siteUrlHost = `https://${req.headers.host}/app/collection`;
    // const teamKey: string = req.nextUrl.searchParams.get('teamKey');

    if (teamKey !== teamAuthToken) {
      // return new NextResponse('', { status: 404 });
      return res.status(404).end();
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
        message: `An error occurred fetching the collections sitemap, ${JSON.stringify(err, null, 2)}`
      }
    });
    // return new NextResponse(
    //   JSON.stringify({ error: { message: `An error occurred, ${err}` } }),
    //   { status: 500 }
    // );
  }
}
