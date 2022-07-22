import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { IgnoreAssocationsMutation, Maybe, MutationIgnoreAssocationsArgs } from 'graphql/generated/types';

import { useCallback, useState } from 'react';

export interface IgnoreAssociationsMutationResult {
  ignoring: boolean;
  error: string | null;
  ignoreAssociations: (input: MutationIgnoreAssocationsArgs) => Promise<Maybe<IgnoreAssocationsMutation>>;
}

export function useIgnoreAssociationsMutation(): IgnoreAssociationsMutationResult {
  const sdk = useGraphQLSDK();

  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);

  const ignoreAssociations = useCallback(async (input: MutationIgnoreAssocationsArgs) => {
    setLoading(true);
    try {
      console.log('🚀 ~ file: useIgnoreAssociationsMutation.ts ~ line 23 ~ ignoreAssociations ~ eventIdArray', input.eventIdArray);
      const result = await sdk.IgnoreAssocations({
        eventIdArray: input.eventIdArray
        
      });
      
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError(
        'Error ignoring association'
      );
      return null;
    }
  }, [sdk]);

  return {
    ignoring: loading,
    error,
    ignoreAssociations,
  };
}
