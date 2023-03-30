import { useSetLikeMutation } from 'graphql/hooks/useLikeMutations';

import { useNonProfileModal } from './state/useNonProfileModal';
import { useUser } from './state/useUser';

import { useEffect } from 'react';

export function useCheckIsProfileLoaded() {
  const { forceReload } = useNonProfileModal();
  const { currentProfileId, user } = useUser();

  const checkStoreUserLikes = () => {
    const data = localStorage.getItem('nonAuthLikeObject');
    const likeObject = JSON.parse(data);
    return likeObject;
  };
  const likeObject = checkStoreUserLikes();
  const { setLike } = useSetLikeMutation(
    likeObject?.likedId,
    likeObject?.likedType
  );
  useEffect(() => {
    if(currentProfileId && user.currentProfileUrl && likeObject) {
      setLike();
      setTimeout(() => {
        forceReload(likeObject?.likedId);
        localStorage.removeItem('nonAuthLikeObject');
      }, 300);
    }
  }, [user, currentProfileId, setLike, likeObject, forceReload]);
}
