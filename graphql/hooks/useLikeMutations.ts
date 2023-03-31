import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { LikeableType, Maybe } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';

import { useNonProfileModal } from '../../hooks/state/useNonProfileModal';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

export interface LikeMutationResult {
  likeLoading: boolean;
  likeError: string | null;
  setLike: () => Promise<{ __typename?: 'Like'; id?: string; createdAt?: any; updatedAt?: any; likedById?: string; likedId?: string; likedType?: LikeableType; }>

  unsetLikeLoading: boolean;
  unsetLikeError: string | null;
  unsetLike: () => Promise<boolean>
}

export function useSetLikeMutation(likedId: string, likedType: LikeableType, profileName?: string): LikeMutationResult {
  const { setLikeData } = useNonProfileModal();
  const router = useRouter();

  const sdk = useGraphQLSDK();
  const [likeError, setLikeError] = useState<Maybe<string>>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [unsetLikeError, setUnsetLikeError] = useState<Maybe<string>>(null);
  const [unsetLikeLoading, setUnsetLikeLoading] = useState(false);
  const { currentProfileId, user } = useUser();

  const setLike = useCallback(
    async () => {
      const location = router.pathname;
      const likeObject = {
        likedId: likedId,
        likedType: likedType,
        profileName: profileName,
        location: location
      };
      if (!user.currentProfileUrl && !currentProfileId) {
        setLikeData(true, likeObject);
        localStorage.setItem('nonAuthLikeObject', JSON.stringify(likeObject));
        return;
      }
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
    [currentProfileId, likedId, likedType, profileName, router.pathname, sdk, setLikeData, user.currentProfileUrl]
  );

  const unsetLike = useCallback(
    async () => {
      if (!user.currentProfileUrl && !currentProfileId) return;
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
    [currentProfileId, likedId, likedType, sdk, user.currentProfileUrl]
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
