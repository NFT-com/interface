import { useCallback } from 'react';
import useSWR from 'swr';

export function useNonProfileModal() {
  const { data, mutate } = useSWR('nonProfile', {
    fallbackData: {
      isOpen: false,
      isForceReload: false,
      likeData: {
        likedId: '',
        likedType: '',
        profileName: ''
      }
    }
  });
  const useForceReloadData = () => {
    mutate({
      ...data,
      isForceReload: !data.isForceReload
    });
  };
  const setLikeData = useCallback((isOpen: boolean, likeData?: {likedId: string, likedType: string}) => {
    mutate({
      ...data,
      likeData: likeData ? likeData : data.likeData,
      isOpen: isOpen
    });
  }, [data, mutate]);

  return {
    isOpen: data.isOpen,
    likeData: data.likeData,
    isForceReload: data.isForceReload,
    forceReload: useForceReloadData,
    setLikeData
  };
}

