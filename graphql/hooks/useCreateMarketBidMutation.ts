import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CreateBidInput, Maybe } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface CreateMarketBidResult {
  creatingBid: boolean;
  error: string | null;
  createMarketBid: (input: CreateBidInput) => Promise<boolean>;
}

export function useCreateMarketBidMutation(): CreateMarketBidResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const createMarketBid = useCallback(
    async (input: CreateBidInput) => {
      setLoading(true);
      try {
        const result = await sdk.CreateMarketBid({
          input: input,
        });
        
        if(!result) {
          throw Error('CreateMarketBid mutation failed');
        }

        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        setError('Bid Creation Failed. Please try again.');
        return false;
      }
    },
    [sdk]
  );

  return {
    creatingBid: loading,
    error: error,
    createMarketBid: createMarketBid,
  };
}