import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, OrderingUpdatesInput } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface OrderingUpdateResult {
  loading: boolean;
  error: string | null;
  updateOrder: (input: OrderingUpdatesInput) => Promise<boolean>;
}

export function useProfileOrderingUpdateMutation(): OrderingUpdateResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const updateOrder = useCallback(
    async (input: OrderingUpdatesInput) => {
      setLoading(true);
      try {
        await sdk.ProfileNftOrderingUpdates({ input: input });
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Mutation failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    loading,
    error,
    updateOrder,
  };
}
