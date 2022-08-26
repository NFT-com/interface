import { fetcher, getAnalyticsEndpoint } from 'utils/helpers';

import { Moment } from 'moment';
import moment from 'moment';
import useSWR from 'swr';

export function useGetCollectionLowestPriceHistory(collectionId: string, dateFrom: Moment) {
  const nowFormatted = moment().format('YYYY-MM-DD').toString();
  const dateFromFormatted = dateFrom.format('YYYY-MM-DD').toString();

  const { data, error } = useSWR(
    `${getAnalyticsEndpoint('Aggregation')}:443/collection/${collectionId}/lowest_price/history?from=${dateFromFormatted}&to=${nowFormatted}`,
    fetcher
  );

  if (error) return 'error';
  if (!data) return null;
  return data;
}