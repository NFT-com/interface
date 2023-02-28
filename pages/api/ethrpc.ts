import { isNullOrEmpty } from 'utils/helpers';

import { withSentry } from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const ethRpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let chainId = req.query['chainId'];
  if (isNullOrEmpty(chainId) || Number.isNaN(Number(chainId))) {
    chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  }

  const INFURA_PREFIXES = {
    '1': 'mainnet',
    '5': 'goerli',
  };

  const keys = process.env.INFURA_KEY_SET ?
    process.env.INFURA_KEY_SET?.split(',') :
    [ // fallback infura keys
      '710542729f894e218b3c54a43bff942b',
      '0d29153d2e294348a6d7ecb6a763d427',
      '7bbeea51b4404b07a42baa389399fea3'
    ];
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