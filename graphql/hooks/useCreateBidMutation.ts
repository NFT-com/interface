import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { BidInput, Maybe } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CreateBidResult {
  creating: boolean;
  error: string | null;
  createBid: (input: BidInput) => Promise<boolean>;
}

/**
 * Provides a function to create a bid with given input values.
 */
export function useCreateBidMutation(): CreateBidResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const createBid = useCallback(
    async (input: BidInput) => {
      setLoading(true);
      try {
        const result = await sdk.CreateBid({
          input: input,
        });

        if (!result) {
          throw Error('CreateBid mutation failed.');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Bid Create failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    creating: loading,
    error: error,
    createBid: createBid,
  };
}
