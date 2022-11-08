import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const segmentHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestUrl = 'https://cdn.segment.com/analytics.js/v1/' + process.env.SEGMENT_API_KEY + '/analytics.min.js';

  try {
    const result = await fetch(requestUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
    }).then(segmentRes => segmentRes.json());
    res.status(200).json( result );
    return;
  } catch (e) {
    res.status(500).json(JSON.stringify({ message: 'Error processing segmento.io result' }));
    return;
  }
};

export default withSentry(segmentHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};