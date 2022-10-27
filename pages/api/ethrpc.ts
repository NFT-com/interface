import { isNullOrEmpty } from 'utils/helpers';

import { ALCHEMY_KEYS, ALCHEMY_PREFIXES } from './alchemynft';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const ethRpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let chainId = req.query['chainId'];
  if (isNullOrEmpty(chainId) || Number.isNaN(Number(chainId))) {
    chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  }

  const alchemyAPIKey = ALCHEMY_KEYS[chainId as string];

  const apiUrl = `https://eth-${ALCHEMY_PREFIXES[chainId as string]}.alchemyapi.io/v2/${alchemyAPIKey}`;

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