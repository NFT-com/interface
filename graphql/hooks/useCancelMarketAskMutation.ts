import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, Scalars } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CancelMarketAskResult {
  cancelling: boolean;
  error: string | null;
  cancelMarketAsk: (id: Scalars['ID'], txHash: string) => Promise<boolean>;
}

/**
 * Cancels Market Ask (listing) with given ID.
 */
export function useCancelMarketAskMutation(): CancelMarketAskResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const cancelMarketAsk = useCallback(
    async (askId: Scalars['ID'], txHash: string) => {
      setLoading(true);
      try {
        const result = await sdk.CancelMarketAsk({
          input: {
            marketAskId: askId,
            txHash: txHash
          }
        });

        if(!result) {
          throw Error('CancelMarketAsk mutation failed.');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Cancel Listing failed. Please try again');
        return false;
      }
    },
    [sdk]
  );

  return {
    cancelling: loading,
    error: error,
    cancelMarketAsk,
  };
}
