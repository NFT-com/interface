import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';

import { useCallback } from 'react';

export function useFetchPendingAssociations() {
  const sdk = useGraphQLSDK();
    
  const fetchAssociations = useCallback(async () => {
    try {
      const result = await sdk.GetMyPendingAssociations();
      return result;
    } catch (error) {
      return null;
    }
  }, [sdk]);
  return {
    fetchAssociations,
  };
}