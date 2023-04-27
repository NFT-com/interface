import { useCallback } from 'react';
import useSWR from 'swr';

export function useCommentsModal() {
  const { data, mutate } = useSWR('commentsModal', {
    fallbackData: {
      isOpen: false,
      commentsData: {
        entityId: '',
      }
    }
  });

  const toggleCommentsModal = useCallback((isOpen: boolean, entityId?: string ) => {
    mutate({
      ...data,
      isOpen: isOpen,
      commentsData: {
        entityId: entityId
      }
    });
  }, [data, mutate]);

  return {
    isOpen: data.isOpen,
    commentsData: data.commentsData,
    toggleCommentsModal
  };
}

