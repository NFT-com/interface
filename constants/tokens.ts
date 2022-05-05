import { Token } from '@uniswap/sdk-core';
import { chainId } from 'wagmi';

export const DAI = new Token(
  chainId.mainnet,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
);

export const USDC = new Token(
  chainId.mainnet,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
);