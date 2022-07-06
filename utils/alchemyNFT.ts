import { Doppler,getEnv } from './env';

import { BigNumber, BigNumberish } from 'ethers';

export async function getNftMetadata(
  contract: string,
  tokenId: BigNumberish,
  chainId: string | number,
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/alchemynft');
  url.searchParams.set('contractAddress', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  url.searchParams.set('tokenType', 'erc721');
  url.searchParams.set('action', 'getNftMetadata');
  url.searchParams.set('chainId', String(chainId));
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

export async function getNftsByContract(
  owner: string,
  contract: string,
  chainId: string | number,
  pageKey: string | null,
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/alchemynft');
  url.searchParams.set('contractAddress', contract);
  url.searchParams.set('owner', owner);
  url.searchParams.set('action', 'getNfts');
  url.searchParams.set('chainId', String(chainId));
  url.searchParams.set('pageKey', pageKey);
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}