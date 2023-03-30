import { useCallback } from 'react';
import useSWR from 'swr';

export function useNonProfileModal() {
  const { data, mutate } = useSWR('nonProfile', {
    fallbackData: {
      isOpen: false,
      likeId: '',
      likeData: {
        likedId: '',
        likedType: '',
        profileName: ''
      }
    }
  });
  const useForceReloadData = (id: string) => {
    mutate({
      ...data,
      likeId: id
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
    likeId: data.likeId,
    forceReload: useForceReloadData,
    setLikeData
  };
}

