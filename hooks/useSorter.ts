import { useEffect, useState } from 'react';

export interface Sorter<T> {
  sortDescending: boolean;
  setSortDescending: (val: boolean) => void;
  ascending: Array<T>;
  descending: Array<T>;
}

/**
 * Helper hook to keep a list of data sorted
 * (both ascending and descending).
 *
 * This hook holds the common state patterns.
 *
 * These params must not change on every render! Wrap them in useState/useCallback.
 * @param data array to be sorted.
 * @param sortingFunction function which will sort the data in ascending order.
 *
 * Changes to these two params happen with a simple reference check.
 */
export function useSorter<T>(
  data: Array<T> | null | undefined,
  sortingFunction: (a: T, b: T) => number
): Sorter<T> {
  const [sortDescending, setSortDescending] = useState(true);
  const [ascending, setAscending] = useState<Array<T>>([]);
  const [descending, setDescending] = useState<Array<T>>([]);
  useEffect(() => {
    const asc = data?.slice().sort(sortingFunction);
    setAscending(asc ?? []);
    setDescending(asc?.slice().reverse() ?? []);
  }, [data, sortingFunction]);
  return {
    sortDescending: sortDescending,
    setSortDescending: setSortDescending,
    ascending: ascending,
    descending: descending,
  };
}
