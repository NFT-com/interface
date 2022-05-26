import { nftToken } from 'constants/contracts';

import { Token } from '@uniswap/sdk-core';
import { chainId } from 'wagmi';

export const DAI = new Token(
  chainId.mainnet,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
);

export const DAI_RINKEBY = new Token(
  chainId.rinkeby,
  '0x6f5390a8cd02d83b23c5f1d594bffb9050eb4ca3',
  18,
  'DAI',
  'Mock DAI'
);

export const USDC = new Token(
  chainId.mainnet,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
);

export const USDC_RINKEBY = new Token(
  chainId.rinkeby,
  '0x7338fe8001a27b63ecdfe4e7a8b226475022edae',
  6,
  'USDC',
  'USDC'
);

export const WETH = new Token(
  chainId.mainnet,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  6,
  'WETH',
  'Wrapped Ether'
);

export const WETH_RINKEBY = new Token(
  chainId.rinkeby,
  '0xc778417e063141139fce010982780140aa0cd5ab',
  6,
  'WETH',
  'Wrapped Ether'
);

// export const NFT_TOKEN = new Token(
//   chainId.mainnet,
//   nftToken[chainId.mainnet],
//   18,
//   'NFT',
//   'NFT.com'
// );

// export const NFT_TOKEN_RINKEBY = new Token(
//   chainId.rinkeby,
//   nftToken[chainId.rinkeby],
//   18,
//   'NFT',
//   'NFT.com'
// );