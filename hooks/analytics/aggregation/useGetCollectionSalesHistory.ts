import { fetcher, formatDateForIndexer, getAnalyticsEndpoint } from 'utils/helpers';

import useSWR from 'swr';

/**
 * Gets the sales history for a collection between two dates
 * @param collectionId | collection-id  of collection to query
 * @param dateFrom | YYYY-MM-DD
 * @param dateTo | YYYY-MM-DD
 * @returns 
 */
export function useGetCollectionSalesHistory(collectionId: string, dateFrom: Date, dateTo: Date) {
  const dateToFormatted = formatDateForIndexer(dateTo);
  const dateFromFormatted = formatDateForIndexer(dateFrom);

  const { data, error } = useSWR(
    `${getAnalyticsEndpoint('Aggregation')}:443/collection/${collectionId}/sales/history?from=${dateFromFormatted}&to=${dateToFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if(!data) return null;
  return data;
}