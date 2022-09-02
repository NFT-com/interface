import { Doppler, getEnv } from 'utils/env';

import useSWR from 'swr';

export function useGetSalesByNFT(contractAddress: string, tokenId: string) {
  const { data } = useSWR(
    'useGetSalesByNFT' + contractAddress + tokenId,
    async () => {
      if (!contractAddress || !tokenId) {
        return null;
      }
      const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/nftport');
      url.searchParams.set('category', 'nfts');
      url.searchParams.set('contractAddress', contractAddress);
      url.searchParams.set('tokenId', tokenId);
      url.searchParams.set('type', 'sale');
      const result = await fetch(url.toString()).then(res => res.json());
      return result;
    }
  );

  return data;
}