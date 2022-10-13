import { useCallback } from 'react';
import useSWR from 'swr';

export function useMintModal() {
  const { data, mutate } = useSWR('mintModal', { fallbackData: false });

  const loading = !data;

  const setModalOpen = useCallback((open: boolean) => {
    mutate(open);
  }, [mutate]);

  return {
    loading,
    modalOpen: data,
    setModalOpen,
  };
}

