import { isNullOrEmpty } from 'utils/helpers';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const ethRpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let chainId = req.query['chainId'];
  if (isNullOrEmpty(chainId) || Number.isNaN(Number(chainId))) {
    chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  }

  res.setHeader('Cache-Control', 's-maxage=10'); // 10 second cache

  const INFURA_PREFIXES = {
    '1': 'mainnet',
    '5': 'goerli',
  };
  
  // fallback infura keys
  const fallback = [
    '710542729f894e218b3c54a43bff942b',
    '0d29153d2e294348a6d7ecb6a763d427',
    '7bbeea51b4404b07a42baa389399fea3',
    '5c8f2ca5a2164b6da4bf2727b8f7b172',
    '190689f3d18e429f9034156e608f333d',
    'aced7c4b23f64cd28b7cb964f9033af0',
  ];

  const keys = process.env.INFURA_KEY_SET ?
    process.env.INFURA_KEY_SET?.split(',').concat(fallback) :
    fallback;
  const infuraAPIKey = keys[Math.floor(Math.random() * keys.length)];

  const apiUrl = `https://${INFURA_PREFIXES[chainId as string]}.infura.io/v3/${infuraAPIKey}`;

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