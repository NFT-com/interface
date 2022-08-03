// import { isNullOrEmpty } from 'utils/helpers';
import { TypesenseSearchInput } from 'graphql/generated/types';
import { getTypesenseInstantsearchAdapterRaw } from 'utils/typeSenseAdapters';

import { useCallback, useState } from 'react';

export interface FetchTypesenseSearchData {
  fetchTypesenseSearch: (input: TypesenseSearchInput) => Promise<any>;
  loading: boolean;
}

export function useFetchTypesenseSearch(): FetchTypesenseSearchData {
  const [loading, setLoading] = useState(false);
  const client = getTypesenseInstantsearchAdapterRaw;

  const fetchTypesenseSearch = useCallback(async (input: TypesenseSearchInput) => {
    setLoading(true);
    try {
      setLoading(true);
      const result = await client.collections(input.index)
        .documents()
        .search({
          'q'         : input.searchTerm.toString(),
          'query_by'  : input.queryFields,
          'per_page': input.perPage,
          'page': input.page,
        });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      // todo: handle the error based on the error code.
      console.log(error);
      return null;
    }
  }, [client]);

  return {
    fetchTypesenseSearch,
    loading: loading,
  };
}
