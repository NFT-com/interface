import { isNullOrEmpty } from 'utils/helpers';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const ethRpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const chainId = req.query['chainId'];
  try {
    if (isNullOrEmpty(chainId) || Number.isNaN(Number(chainId))) {
      throw new Error('chainId is required');
    }
  } catch (e) {
    res.status(400).json({ message: 'Invalid Chain ID' });
  }

  const alchemyAPIKey = Number(chainId) !== 1 ?
    process.env.ALCHEMY_RINKEBY_KEY :
    process.env.ALCHEMY_MAINNET_KEY;
  const apiUrl = `https://eth-${Number(chainId) !== 1 ? 'rinkeby' : 'mainnet'}.alchemyapi.io/v2/${alchemyAPIKey}`;
  try {
    const result = await fetch(apiUrl, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(req.body)
    }).then(res => res.json());
    res.status(200).json( result );
  } catch (e) {
    res.status(500).json({ message: 'ETH RPC: error' });
  }
};

export default withSentry(ethRpcHandler);

export const config = {
  api: {
    externalResolver: true,
  },
};