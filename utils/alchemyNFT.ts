import { BigNumber, BigNumberish } from 'ethers';

export async function getNftMetadata(
  contract: string,
  tokenId: BigNumberish,
  chainId: string,
) {
  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL + 'api/alchemynft');
  url.searchParams.set('contractAddress', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  url.searchParams.set('tokenType', 'erc721');
  url.searchParams.set('action', 'getNftMetadata');
  url.searchParams.set('chainId', chainId);
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

export async function getNftsByContract(
  owner: string,
  contract: string,
  chainId: string,
) {
  const url = new URL(process.env.NEXT_PUBLIC_BASE_URL + 'api/alchemynft');
  url.searchParams.set('contractAddress', contract);
  url.searchParams.set('owner', owner);
  url.searchParams.set('action', 'getNfts');
  url.searchParams.set('chainId', chainId);
  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}