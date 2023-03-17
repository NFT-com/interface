import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { LikeableType, Maybe } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';

import { useCallback, useState } from 'react';

export interface SetLikeMutationResult {
  loading: boolean;
  error: string | null;
  setLike: () => Promise<{ __typename?: 'Like'; id?: string; createdAt?: any; updatedAt?: any; likedById?: string; likedId?: string; likedType?: LikeableType; }>
}

export function useSetLikeMutation(likedId: string, likedType: LikeableType): SetLikeMutationResult {
  const sdk = useGraphQLSDK();
  const [error, setError] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState(false);
  const { currentProfileId } = useUser();

  const setLike = useCallback(
    async () => {
      setLoading(true);
      try {
        const result = await sdk.SetLike({
          input: {
            likedById: currentProfileId,
            likedId,
            likedType
          }
        });

        if (!result) {
          throw Error('SetLike mutation failed.');
        }

        setLoading(false);
        return result?.setLike;
      } catch (err) {
        setLoading(false);
        setError('SetLike failed. Please try again.');
        return null;
      }
    },
    [currentProfileId, likedId, likedType, sdk]
  );

  return {
    loading,
    error,
    setLike,
  };
}
