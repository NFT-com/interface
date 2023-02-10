import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CreateAskInput, Maybe } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CreateMarketAskResult {
  creating: boolean;
  error: string | null;
  createMarketAsk: (input: CreateAskInput) => Promise<boolean>;
}

/**
 * Provides a function to create a marketplace ask (i.e. listing) with given input values.
 */
export function useCreateMarketAskMutation(): CreateMarketAskResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const createMarketAsk = useCallback(
    async (input: CreateAskInput) => {
      setLoading(true);
      try {
        const result = await sdk.CreateMarketAsk({
          input: input,
        });

        if (!result) {
          throw Error('CreateMarketAsk mutation failed.');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Listing Creation failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    creating: loading,
    error: error,
    createMarketAsk: createMarketAsk,
  };
}
