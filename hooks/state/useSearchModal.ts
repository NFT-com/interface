import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', {
    fallbackData:
    {
      modalType: 'search',
      searchModalOpen: false
    } });

  const loading = !data;
  
  const useToggleSearchModal = () => {
    mutate({
      ...data,
      searchModalOpen: !data.searchModalOpen
    });
  };

  const setSearchModalOpen = (searchModalOpen: boolean, modalType = 'search') => {
    mutate({
      ...data,
      searchModalOpen,
      modalType
    });
  };

  const setModalType = (modalType: 'search' | 'filters') => {
    mutate({
      ...data,
      modalType
    });
  };

  return {
    loading,
    modalType: data.modalType,
    searchModalOpen: data.searchModalOpen,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
    setModalType,
  };
}

