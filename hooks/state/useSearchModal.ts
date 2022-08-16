import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', {
    fallbackData:
    {
      modalType: 'search',
      searchModalOpen: false,
      sideNavOpen: false,
    } });

  const loading = !data;
  
  const useToggleSearchModal = () => {
    mutate({
      ...data,
      searchModalOpen: !data.searchModalOpen
    });
  };

  const setSearchModalOpen = useCallback((searchModalOpen: boolean, modalType = 'search') => {
    mutate({
      ...data,
      searchModalOpen,
      modalType
    });
  }, [data, mutate]);

  const setModalType = useCallback((modalType: 'search' | 'filters') => {
    mutate({
      ...data,
      modalType
    });
  },[data, mutate]);

  const setSideNavOpen = useCallback((sideNavOpen: boolean) => {
    mutate({
      ...data,
      sideNavOpen,
    });
  }, [data, mutate]);

  return {
    loading,
    modalType: data.modalType,
    searchModalOpen: data.searchModalOpen,
    sideNavOpen: data.sideNavOpen,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
    setModalType,
    setSideNavOpen,
  };
}

