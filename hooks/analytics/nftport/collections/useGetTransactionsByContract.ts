import { Doppler, getEnv } from 'utils/env';

import useSWR from 'swr';

export function useGetTransactionsByContract(contractAddress: string) {
  const { data } = useSWR(
    'useGetTransactionsByContract' + contractAddress,
    async () => {
      if (!contractAddress) {
        return null;
      }
      const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/nftport');
      url.searchParams.set('category', 'nfts');
      url.searchParams.set('contractAddress', contractAddress);
      url.searchParams.set('type', 'all');
      const result = await fetch(url.toString()).then(res => res.json());
      return result;
    }
  );

  return data;
}