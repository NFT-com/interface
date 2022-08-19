import { Doppler, getEnv } from './env';
import { isNullOrEmpty } from './helpers';

import { BigNumber, BigNumberish } from 'ethers';

export async function getOpenseaCollection(
  contract: string,
): Promise<any> {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/opensea');
  url.searchParams.set('contract', contract);
  url.searchParams.set('action', 'getCollection');

  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

export async function getLooksrareNonce(address: string): Promise<number> {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/looksrare');
  url.searchParams.set('action', 'getNonce');
  url.searchParams.set('address', address);
  const result = await fetch(url.toString()).then(res => res.json());
  return BigNumber.from(result?.['data'] ?? 0).toNumber();
}

export async function getSeaportOrders(contract: string, tokenId: BigNumberish): Promise<any> {
  if (tokenId == null || isNullOrEmpty(contract)) {
    return [];
  }
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/seaport');
  url.searchParams.set('action', 'getOrders');
  url.searchParams.set('contract', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  const result = await fetch(url.toString()).then(res => res.json());
  console.log({ seaportOrders: result });
}

export async function getLooksrareOrders(contract: string, tokenId: BigNumberish): Promise<any> {
  if (tokenId == null || isNullOrEmpty(contract)) {
    return [];
  }
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/looksrare');
  url.searchParams.set('action', 'getOrders');
  url.searchParams.set('contract', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  const result = await fetch(url.toString()).then(res => res.json());
  console.log({ looksrareOrders: result });
}