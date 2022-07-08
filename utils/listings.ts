import { Doppler, getEnv } from './env';

import { MakerOrderWithSignature } from '@looksrare/sdk';
import { BigNumber } from 'ethers';
import { SeaportOrderComponents } from 'types';

export async function listSeaport(
  signature: string,
  parameters: SeaportOrderComponents
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/seaport');
  url.searchParams.set('signature', signature);
  url.searchParams.set('parameters', JSON.stringify(parameters));
  url.searchParams.set('action', 'listNFT');
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

export async function listLooksrare(
  parameters: MakerOrderWithSignature
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/looksrare');
  url.searchParams.set('order', JSON.stringify(parameters));
  url.searchParams.set('action', 'listNFT');
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}