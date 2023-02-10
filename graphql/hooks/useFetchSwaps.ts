import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetMarketSwap, PageInput } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';

export interface GetSwapsData {
  fetchSwaps: (makerAddress: string, pageInput: PageInput) => Promise<PartialDeep<GetMarketSwap>>;
  loading: boolean;
}

export function useFetchSwaps(): GetSwapsData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);

  const fetchSwaps = useCallback(async (makerAddress: string, pageInput: PageInput) => {
    if (isNullOrEmpty(makerAddress)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.GetUserSwaps({
        input: {
          participant: makerAddress,
          pageInput
        }
      });
      setLoading(false);
      return result?.getUserSwaps;
    } catch (error) {
      setLoading(false);
      return null;
    }
  }, [sdk]);

  return {
    fetchSwaps,
    loading: loading,
  };
}
