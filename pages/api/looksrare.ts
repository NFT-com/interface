
import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const looksrareHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // todo: make call to looksrare listing api
    res.status(200).json( {} );
  } catch (e) {
    res.status(500).json({ message: 'ETH RPC: error' });
  }
};

export default withSentry(looksrareHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};