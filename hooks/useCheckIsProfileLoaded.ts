import { useSetLikeMutation } from 'graphql/hooks/useLikeMutations';
import { useProfileLikeQuery } from 'graphql/hooks/useProfileLikeQuery';
import { useUser } from './state/useUser';

import { useEffect } from 'react';

export function useCheckIsProfileLoaded() {
  const { currentProfileId, user } = useUser();
  const { mutate } = useProfileLikeQuery(user?.currentProfileUrl);

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
      mutate();
      localStorage.removeItem('nonAuthLikeObject');
    }
  }, [user, currentProfileId, setLike, likeObject, mutate]);
}
