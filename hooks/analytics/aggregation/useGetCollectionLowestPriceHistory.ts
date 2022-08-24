import { fetcher, formatDateForIndexer } from 'utils/helpers';

import useSWR from 'swr';

export function useGetCollectionLowestPriceHistory(collectionId: string, dateFrom: Date, dateTo: Date) {
  const dateToFormatted = formatDateForIndexer(dateTo);
  const dateFromFormatted = formatDateForIndexer(dateFrom);

  const { data, error } = useSWR(
    `https://dev-analytics-aggregation:443/collection/${collectionId}/lowest_price/history?from=${dateFromFormatted}&to=${dateToFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if (!data) return null;
  return data;
}