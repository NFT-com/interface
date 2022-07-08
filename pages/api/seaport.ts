
import { isNullOrEmpty } from 'utils/helpers';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const seaPortHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const action = req.query['action'];
  
  switch(action) {
  case 'listNFT':
    try {
      const signature = req.query['signature'];
      const parameters = JSON.parse(req.query['parameters'] as string);
      if (isNullOrEmpty(signature)) {
        res.status(400).json({ message: 'listNFT: Invalid Signature' });
        return;
      }
      if (isNullOrEmpty(parameters)) {
        res.status(400).json({ message: 'listNFT: Invalid Parameters' });
        return;
      }
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.OPENSEA_API_KEY
        },
        body: JSON.stringify({
          signature,
          parameters
        })
      };
      const result = await fetch(
        'https://api.opensea.io/v2/orders/ethereum/seaport/listings',
        options
      ).then(res => res.json());
      res.status(200).json( result );
    } catch (e) {
      res.status(500).json({ message: 'Failed to list NFT on Seaport', error: e });
    }
    break;
  default:
    res.status(400).json({ message: 'Invalid action' });
    return;
  }
};

export default withSentry(seaPortHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};