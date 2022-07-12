import { Doppler, getEnv } from './env';

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

export async function listLooksrare(
  // todo: https://github.com/LooksRare/looksrare-sdk/blob/master/doc/guide.md#how-to-create-and-sign-an-order
) {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/alchemynft');
  //   url.searchParams.set('contractAddress', contract);
  //   url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  //   url.searchParams.set('tokenType', 'erc721');
  //   url.searchParams.set('action', 'getNftMetadata');
  //   url.searchParams.set('chainId', String(chainId));
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}