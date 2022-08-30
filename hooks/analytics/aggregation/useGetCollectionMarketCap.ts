import { Doppler, getEnv } from 'utils/env';
import { fetcher } from 'utils/helpers';

import moment, { Moment } from 'moment';
import useSWR from 'swr';

export function useGetCollectionMarketCap(collectionId: string, dateFrom: Moment) {
  const dateToFormatted = moment().format('YYYY-MM-DD').toString();
  const dateFromFormatted = dateFrom.format('YYYY-MM-DD').toString();

  const { data, error } = useSWR(
    `${getEnv(Doppler.NEXT_PUBLIC_ANALYTICS_AGGREGATION_ENDPOINT)}/collection/${collectionId}/market_cap/history?from=${dateFromFormatted}&to=${dateToFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if (!data) return null;
  return data;
}