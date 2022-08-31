import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR from 'swr';

export function useGetNFTDetails(contractAddress: string, tokenId: string) {
  const { data } = useSWR(
    'useGetNFTDetails' + contractAddress + tokenId,
    async () => {
      if (isNullOrEmpty(contractAddress)) {
        return null;
      }
      const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/nftport');
      url.searchParams.set('category', 'nfts');
      url.searchParams.set('contractAddress', contractAddress);
      url.searchParams.set('tokenId', tokenId);
      url.searchParams.set('apiType', 'nft');
      const result = await fetch(url.toString()).then(res => res.json());
      return result;
    }
  );

  return data;
}