import { fetcher, formatDateForIndexer, getAnalyticsEndpoint } from 'utils/helpers';

import useSWR from 'swr';

export function useGetCollectionSize(collectionId: string, dateFrom: Date, dateTo: Date) {
  const dateToFormatted = formatDateForIndexer(dateTo);
  const dateFromFormatted = formatDateForIndexer(dateFrom);

  const { data, error } = useSWR(
    `${getAnalyticsEndpoint('Aggregation')}:443/collection/${collectionId}/size/history?from=${dateFromFormatted}&to=${dateToFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if (!data) return null;
  return data;
}