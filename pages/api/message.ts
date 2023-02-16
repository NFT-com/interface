import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const message = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = 'https://slack.com/api/chat.postMessage';
  try {
    // only in prod
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      },
      body: JSON.stringify({
        channel: 'sub-nftdotcom-analytics',
        text: req.query.text,
        username: 'NFT.com Bot',
        pretty: 1,
        mrkdwn: true,
      }),
    });

    res.status(200).json('ok');
  } catch (err) {
    res.status(401).json('error');
  }
};

export default withSentry(message);

export const config = {
  api: {
    externalResolver: true,
    responseLimit: false,
  },
};