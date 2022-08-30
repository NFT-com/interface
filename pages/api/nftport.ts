import { isNullOrEmpty } from 'utils/helpers';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const nftportHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const contractAddress = req.query['contractAddress'];
  if (isNullOrEmpty(contractAddress)) {
    res.status(400).json({ message: 'nftport handler: Invalid Arguments' });
  }

  const apiUrl = new URL(`https://api.nftport.xyz/v0/transactions/stats/${contractAddress}?chain=ethereum`);

  try {
    const result = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': process.env.NFTPORT_KEY,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    res.status(200).json( result );
  } catch (e) {
    res.status(500).json({ message: 'ETH RPC: error' });
  }
};

export default withSentry(nftportHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};