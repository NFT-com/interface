import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';

import { useCallback } from 'react';

export interface RefreshMyNftsResult {
  refreshMyNFTs: () => Promise<boolean>
}

export function useRefreshMyNftsMutation(): RefreshMyNftsResult {
  const sdk = useGraphQLSDK();

  const refreshMyNFTs = useCallback(
    async () => {
      try {
        await sdk.RefreshMyNFTs();
        return true;
      } catch (err) {
        console.log('error RefreshMyNFTs: ', err);
        return false;
      }
    },
    [sdk]
  );

  return {
    refreshMyNFTs: refreshMyNFTs,
  };
}
