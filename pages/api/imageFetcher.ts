import { Doppler, getEnvBool } from 'utils/env';

import { withSentry } from '@sentry/nextjs';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const imageFetcher = async (req: NextApiRequest, res: NextApiResponse) => {
  const r = await axios.get(`https://5hi24d3w2gny6zrfhekqk6mv4e0cfois.lambda-url.us-east-1.on.aws?url=${encodeURIComponent(`${req.query.url}`)}&width=${Number(req.query.width) || 1000}&height=${Number(req.query.height) || 1000}`);
  const optimizedUrl = r.data.data;
  const result = await fetch(optimizedUrl);
  if (result.statusText == 'Unprocessable Entity' || !getEnvBool(Doppler.NEXT_PUBLIC_IMAGE_PROXY_ENABLED)) {
    const originalResult = await fetch(decodeURIComponent(`${req.query.url}`));
    const originalBody = await originalResult.body;
    originalBody.pipe(res);
  } else {
    const body = await result.body;
    body.pipe(res);
  }
};

export default withSentry(imageFetcher);

export const config = {
  api: {
    externalResolver: true,
    responseLimit: false,
  },
};