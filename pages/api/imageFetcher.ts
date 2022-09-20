import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const imageFetcher = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = decodeURIComponent(`${req.query.url}`);
  const result = await fetch(url);
  const body = await result.body;
  body.pipe(res);
};

export default withSentry(imageFetcher);

export const config = {
  api: {
    externalResolver: true,
  },
};