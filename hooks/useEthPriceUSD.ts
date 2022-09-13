import axios from 'axios';
import useSWRImmutable from 'swr/immutable';

export function useEthPriceUSD() {
  const { data } = useSWRImmutable('ethUSD', () =>
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
  );
  return data?.data?.['ethereum']?.['usd'];
}
