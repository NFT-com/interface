import { useCallback } from 'react';
import useSWR from 'swr';

export function useNonProfileModal() {
  const { data, mutate } = useSWR('nonProfile', {
    fallbackData: {
      isOpen: false,
      likeData: {
        likedId: '',
        likedType: '',
        profileName: ''
      }
    }
  });

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
    setLikeData
  };
}

