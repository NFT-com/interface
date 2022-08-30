import indexedCollections from 'constants/indexedCollections.json';
import { Doppler, getEnv } from 'utils/env';

import useSWR from 'swr';

export function useGetSalesStats(contractAddress: string) {
  const { data } = useSWR(
    'useGetSalesStats' + contractAddress,
    async () => {
      if (!contractAddress || !indexedCollections.includes(contractAddress)) {
        return null;
      }
      const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/nftport');
      url.searchParams.set('contractAddress', contractAddress);
      const result = await fetch(url.toString()).then(res => res.json());
      return result;
    }
  );

  return data;
}