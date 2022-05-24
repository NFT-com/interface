import axios from 'axios';
import useSWR from 'swr';

export function useEthPriceUSD() {
  const { data } = useSWR('ethUSD', () =>
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
  );
  return data?.data?.['ethereum']?.['usd'];
}
