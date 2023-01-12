import { withSentry } from '@sentry/nextjs';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const imageFetcher = async (req: NextApiRequest, res: NextApiResponse) => {
  const gcp_enabled = process.env.GCP_IMG_PROXY_ENABLED;
  if (gcp_enabled) {
    return 'https://clonex-assets.rtfkt.com/images/6471.png?width=600';
  }

  const r = await axios.get(`https://5hi24d3w2gny6zrfhekqk6mv4e0cfois.lambda-url.us-east-1.on.aws?gcp=${gcp_enabled}&url=${encodeURIComponent(`${req.query.url}`)}&width=${Number(req.query.width) || 1000}&height=${Number(req.query.height) || 1000}`);
  const optimizedUrl = r.data.data;
  const result = await fetch(optimizedUrl);
  if (result.statusText == 'Unprocessable Entity' || !process.env.IMAGE_PROXY_ENABLED) {
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