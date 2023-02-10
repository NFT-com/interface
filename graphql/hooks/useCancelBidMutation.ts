import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, Scalars } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CancelBidResult {
  removing: boolean;
  error: string | null;
  cancelBid: (id: Scalars['ID']) => Promise<boolean>;
}

/**
 * Cancels the bid with given ID.
 */
export function useCancelBidMutation(): CancelBidResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const cancelBid = useCallback(
    async (id: Scalars['ID']) => {
      setLoading(true);
      try {
        const result = await sdk.CancelBid({
          id: id,
        });

        if (!result) {
          throw Error('CancelBid mutation failed.');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Bid cancel failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    removing: loading,
    error: error,
    cancelBid: cancelBid,
  };
}
