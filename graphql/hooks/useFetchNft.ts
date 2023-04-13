import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/format';

import { useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';

export interface FetchNFTData {
  fetchNFT: (contract: string, tokenId: string) => Promise<PartialDeep<Nft>>;
  loading: boolean;
}

export function useFetchNFT(): FetchNFTData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);

  const fetchNFT = useCallback(async (contract: string, tokenId: string) => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(tokenId)) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.Nft({ contract, id: tokenId });
      setLoading(false);
      return result.nft;
    } catch (error) {
      setLoading(false);
      // todo: handle the error based on the error code.
      return null;
    }
  }, [sdk]);

  return {
    fetchNFT,
    loading: loading,
  };
}
