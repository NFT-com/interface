import indexedCollections from 'constants/indexedCollections.json';
import { Doppler, getEnv } from 'utils/env';

import useSWR from 'swr';

const fetcher = async (url, token) =>
  await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());

export function useGetSalesStats(contractAddress: string) {
  const token = getEnv(Doppler.NEXT_PUBLIC_NFTPORT_KEY);
  const { data } = useSWR(
    (!contractAddress || !indexedCollections.includes(contractAddress)
      ? null
      : [`https://api.nftport.xyz/v0/transactions/stats/${contractAddress}?chain=ethereum`, token]),
    fetcher
  );

  return data;
}