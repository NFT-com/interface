import { useCallback } from 'react';
import useSWR from 'swr';
export enum modalTypeEnum {
  Like = 'Like',
  Comment = 'Comment'
}
export function useNonProfileModal() {
  const { data, mutate } = useSWR('nonProfile', {
    fallbackData: {
      isOpen: false,
      likeId: '',
      likeType: '',
      successMessage: '',
      likeData: {
        likedId: '',
        likedType: '',
        profileName: ''
      },
      modalType: ''
    }
  });
  const useForceReloadData = (id: string, likeType: string) => {
    mutate({
      ...data,
      likeId: id,
      likeType: likeType
    });
  };

  const setNonProfileData = useCallback((isOpen: boolean, modalType?: string, likeData?: {likedId: string, likedType: string}) => {
    mutate({
      ...data,
      likeData: likeData ? likeData : data.likeData,
      isOpen: isOpen,
      modalType: modalType
    });
  }, [data, mutate]);

  return {
    isOpen: data.isOpen,
    likeData: data.likeData,
    likeId: data.likeId,
    likeType: data.likeType,
    modalType: data.modalType,
    successMessage: data.successMessage,
    forceReload: useForceReloadData,
    setNonProfileData
  };
}

