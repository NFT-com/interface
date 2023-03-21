import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { LikeableType, Maybe } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';

import { useCallback, useState } from 'react';

export interface UnsetLikeMutationResult {
  loading: boolean;
  error: string | null;
  unsetLike: () => Promise<boolean>
}

export function useUnsetLikeMutation(likedId: string, likedType: LikeableType): UnsetLikeMutationResult {
  const sdk = useGraphQLSDK();
  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);
  const { currentProfileId } = useUser();

  const unsetLike = useCallback(
    async () => {
      setLoading(true);
      try {
        const result = await sdk.UnsetLike({
          input: {
            likedById: currentProfileId,
            likedId,
            likedType
          }
        });

        if (!result) {
          throw Error('UnsetLike mutation failed.');
        }

        setLoading(false);
        analytics.track('Unliked', {
          unlikedById: currentProfileId,
          unlikedId: likedId,
          likedType
        });
        return result?.unsetLike;
      } catch (err) {
        setLoading(false);
        setError('UnsetLike failed. Please try again.');
        return null;
      }
    },
    [currentProfileId, likedId, likedType, sdk]
  );

  return {
    loading,
    error,
    unsetLike,
  };
}
