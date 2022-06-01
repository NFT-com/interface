import { isNullOrEmpty } from 'utils/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

async function AlchemyNftHandler(req: NextApiRequest, res: NextApiResponse) {
  const action = req.query['action'];
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
  
  switch (action) {
  case 'getNftMetadata': {
    const contractAddress = req.query['contractAddress'];
    const tokenId = req.query['tokenId'];
    const tokenType = req.query['tokenType'];
  
    if (
      isNullOrEmpty(contractAddress) ||
        isNullOrEmpty(tokenId) ||
        isNullOrEmpty(tokenType) ||
        !(tokenType === 'erc721' || tokenType === 'erc1155')
    ) {
      res.status(400).json({ message: 'getNftMetadata: Invalid Arguments' });
    }
  
    const requestUrl = new URL(apiUrl + '/getNFTMetadata/');
    requestUrl.searchParams.set('contractAddress', contractAddress as string);
    requestUrl.searchParams.set('tokenId', tokenId as string);
    requestUrl.searchParams.set('tokenType', tokenType as string);
    try {
      const result = await fetch(requestUrl.toString(), {
        method: 'GET',
        redirect: 'follow',
      }).then(alchemyRes => alchemyRes.json());
      res.status(200).json( result );
      break;
    } catch (e) {
      res.status(500).json(JSON.stringify({ message: 'getNfts: error processing Alchemy result' }));
      break;
    }
  }
  case 'getNfts': {
    const owner = req.query['owner'];
    const contractAddress = req.query['contractAddress'];
  
    if (isNullOrEmpty(contractAddress) || isNullOrEmpty(owner)) {
      res.status(400).json(JSON.stringify({ message: 'getNfts: Invalid Arguments' }));
    }
  
    const requestUrl = new URL(apiUrl + '/getNFTs/');
    requestUrl.searchParams.append('contractAddresses[]', contractAddress as string);
    requestUrl.searchParams.set('owner', owner as string);
    try {
      const result = await fetch(requestUrl.toString(), {
        method: 'GET',
        redirect: 'follow',
      }).then(alchemyRes => alchemyRes.json());
      res.status(200).json(result);
      break;
    } catch (e) {
      res.status(500).json(JSON.stringify({ message: 'getNfts: error processing Alchemy result' }));
      break;
    }
  }
  default:
    res.status(400).json(JSON.stringify({ message: 'Action not recognized' }));
  }
}

export default AlchemyNftHandler;