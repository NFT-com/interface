import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const segmentHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const action = req.query['action'];

    const requestUrl = `https://api.segment.io/v1/${action}`;

    // allowed actions = track, identify, page
    if (action == 'track' || action == 'identify' || action == 'page') {
      const body = req.body;
      try {
        const result = await fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(process.env.NEXT_PUBLIC_SEGMENT_API_KEY + ':' + '').toString('base64')}`, // base64 encoding of the write key
          },
          body: JSON.stringify(body),
        }).then(segmentRes => segmentRes.json());
        res.status(200).json(result);
        return;
      } catch (e) {
        res.status(500).json(JSON.stringify({ message: 'error processing inner Segment result' }));
        return;
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
      return;
    }
  } catch (e) {
    res.status(500).json(JSON.stringify({ message: 'error processing outer Segment result' }));
    return;
  }
};

export default withSentry(segmentHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};