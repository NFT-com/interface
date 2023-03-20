import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';

import { useCallback, useState } from 'react';

export interface UnsetLikeMutationResult {
  loading: boolean;
  error: string | null;
  unsetLike: () => Promise<boolean>
}

export function useUnsetLikeMutation(unsetLikeId: string): UnsetLikeMutationResult {
  const sdk = useGraphQLSDK();
  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);
  const { currentProfileId, user } = useUser();

  const unsetLike = useCallback(
    async () => {
      setLoading(true);
      try {
        const result = await sdk.UnsetLike({
          unsetLikeId
        });

        if (!result) {
          throw Error('UnsetLike mutation failed.');
        }

        setLoading(false);
        analytics.track('Unliked', {
          unlikedById: currentProfileId,
          unlikedByProfile: user?.currentProfileUrl,
          unsetLikeId
        });
        return result?.unsetLike;
      } catch (err) {
        setLoading(false);
        setError('UnsetLike failed. Please try again.');
        return null;
      }
    },
    [currentProfileId, sdk, unsetLikeId, user?.currentProfileUrl]
  );

  return {
    loading,
    error,
    unsetLike,
  };
}
