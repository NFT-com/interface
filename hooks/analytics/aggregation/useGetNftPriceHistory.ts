import { Doppler,getEnv } from 'utils/env';
import { fetcher } from 'utils/helpers';

import { Moment } from 'moment';
import moment from 'moment';
import useSWR from 'swr';

export function useGetNftPriceHistory(nftId: string, dateFrom: Moment) {
  const nowFormatted = moment().format('YYYY-MM-DD').toString();
  const dateFromFormatted = dateFrom.format('YYYY-MM-DD').toString();

  const { data, error } = useSWR(
    `${getEnv(Doppler.NEXT_PUBLIC_ANALYTICS_AGGREGATION_ENDPOINT)}/nft/${nftId}/price/history?from=${dateFromFormatted}&to=${nowFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if(!data) return null;
  return data;
}