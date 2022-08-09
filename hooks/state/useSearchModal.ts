import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', { fallbackData: false });

  const loading = !data;
  const useToggleSearchModal = () => {
    mutate(!data);
  };

  const setSearchModalOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    searchModalOpen: data,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
  };
}

