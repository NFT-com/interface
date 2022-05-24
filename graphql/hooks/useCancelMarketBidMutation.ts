import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, Scalars } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CancelMarketBidResult {
  cancelling: boolean;
  error: string | null;
  cancelMarketBid: (id: Scalars['ID'], txHash: string) => Promise<boolean>;
}

/**
 * Cancels Market Ask (listing) with given ID.
 */
export function useCancelMarketBidMutation(): CancelMarketBidResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const cancelMarketBid = useCallback(
    async (askId: Scalars['ID'], txHash: string) => {
      setLoading(true);
      try {
        const result = await sdk.CancelMarketBid({
          input: {
            marketBidId: askId,
            txHash: txHash
          }
        });

        if(!result) {
          throw Error('CancelMarketBid mutation failed.');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Cancel Bid failed. Please try again');
        return false;
      }
    },
    [sdk]
  );

  return {
    cancelling: loading,
    error: error,
    cancelMarketBid,
  };
}
