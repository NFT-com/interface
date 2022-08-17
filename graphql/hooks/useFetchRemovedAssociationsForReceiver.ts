import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { GetRemovedAssociationsForReceiverQuery } from 'graphql/generated/types';

import { useCallback } from 'react';

export interface FetchRemovedAssociationsForReceiver {
  fetchRemovedAssociations: () => Promise<GetRemovedAssociationsForReceiverQuery>
}

export function useFetchRemovedAssociationsForReceiver(): FetchRemovedAssociationsForReceiver {
  const sdk = useGraphQLSDK();
  
  const fetchRemovedAssociations = useCallback(async () => {
    try {
      const result = await sdk.GetRemovedAssociationsForReceiver();
      return result;
    } catch (error) {
      console.log('Failed to load Removed Associations For Receiver.');
    }
  }, [sdk]);

  return {
    fetchRemovedAssociations
  };
}