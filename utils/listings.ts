import { Doppler, getEnv } from './env';

import { BigNumber } from 'ethers';

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
