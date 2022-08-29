import { Doppler,getEnv } from 'utils/env';
import { fetcher } from 'utils/helpers';

import moment, { Moment } from 'moment';
import useSWR from 'swr';

/**
 * Gets the sales history for a collection between two dates
 * @param collectionId | collection-id  of collection to query
 * @param dateFrom | YYYY-MM-DD
 * @param dateTo | YYYY-MM-DD
 * @returns 
 */
export function useGetCollectionSalesHistory(collectionId: string, dateFrom: Moment) {
  const nowFormatted = moment().format('YYYY-MM-DD').toString();
  const dateFromFormatted = dateFrom.format('YYYY-MM-DD').toString();

  const formedRequest = `${getEnv(Doppler.NEXT_PUBLIC_ANALYTICS_AGGREGATION_ENDPOINT)}collection/${collectionId}/sales/history?from=${dateFromFormatted}&to=${nowFormatted}`;

  const { data, error } = useSWR(() => (!collectionId || !dateFrom) ? null : formedRequest, fetcher);

  if (error) return 'error';
  return data;
}