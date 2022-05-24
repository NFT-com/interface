import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { NfTsOutput, PageInput } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface FetchMyNFTsData {
  fetchMyNFTs: (pageInput: PageInput) => Promise<PartialDeep<NfTsOutput>>;
  loading: boolean;
}

export function useFetchMyNFTs(): FetchMyNFTsData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const { data: account } = useAccount();

  const fetchMyNFTs = useCallback(async (pageInput: PageInput) => {
    if (isNullOrEmpty(account?.address)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.MyNFTs({
        input: {
          pageInput
        }
      });
      setLoading(false);
      return result.myNFTs;
    } catch (error) {
      setLoading(false);
      // todo: handle the error based on the error code.
      return null;
    }
  }, [account, sdk]);

  return {
    fetchMyNFTs,
    loading: loading,
  };
}
