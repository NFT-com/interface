import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { LikeableType, Maybe } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';

import { useCallback, useState } from 'react';

export interface LikeMutationResult {
  likeLoading: boolean;
  likeError: string | null;
  setLike: () => Promise<{ __typename?: 'Like'; id?: string; createdAt?: any; updatedAt?: any; likedById?: string; likedId?: string; likedType?: LikeableType; }>

  unsetLikeLoading: boolean;
  unsetLikeError: string | null;
  unsetLike: () => Promise<boolean>
}

export function useSetLikeMutation(likedId: string, likedType: LikeableType): LikeMutationResult {
  const sdk = useGraphQLSDK();
  const [likeError, setLikeError] = useState<Maybe<string>>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [unsetLikeError, setUnsetLikeError] = useState<Maybe<string>>(null);
  const [unsetLikeLoading, setUnsetLikeLoading] = useState(false);
  const { currentProfileId, user } = useUser();

  const setLike = useCallback(
    async () => {
      setLikeLoading(true);
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

        setLikeLoading(false);
        analytics.track(`Liked a ${likedType}`, {
          likedById: currentProfileId,
          likedByProfile: user?.currentProfileUrl,
          likedId,
          likedType
        });
        return result?.setLike;
      } catch (err) {
        setLikeLoading(false);
        setLikeError('SetLike failed. Please try again.');
        return null;
      }
    },
    [currentProfileId, likedId, likedType, sdk, user?.currentProfileUrl]
  );

  const unsetLike = useCallback(
    async () => {
      setUnsetLikeLoading(true);
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

        setUnsetLikeLoading(false);
        analytics.track('Unliked', {
          unlikedById: currentProfileId,
          unlikedId: likedId,
          likedType
        });
        return result?.unsetLike;
      } catch (err) {
        setUnsetLikeLoading(false);
        setUnsetLikeError('UnsetLike failed. Please try again.');
        return null;
      }
    },
    [currentProfileId, likedId, likedType, sdk]
  );

  return {
    likeLoading,
    likeError,
    setLike,
    unsetLikeLoading,
    unsetLikeError,
    unsetLike
  };
}
