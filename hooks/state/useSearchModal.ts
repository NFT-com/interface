import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', { fallbackData: false });

  const loading = !data;
  const useToggleSearchModal = useCallback(() => {
    mutate(!data);
  }, [data, mutate]);

  const setSearchModalOpen = useCallback((open: boolean) => {
    mutate(open);
  }, [mutate]);

  return {
    loading,
    searchModalOpen: data,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
  };
}

