import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', {
    fallbackData:
    {
      modalType: 'search',
      searchModalOpen: false,
      sideNavOpen: false,
      searchFilters: null,
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

  const setSearchFilters = useCallback((searchFilters: any) => {
    mutate({
      ...data,
      searchFilters: [...searchFilters],
    });
  }, [data, mutate]);

  return {
    loading,
    modalType: data.modalType,
    searchModalOpen: data.searchModalOpen,
    sideNavOpen: data.sideNavOpen,
    searchFilters: data.searchFilters,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
    setModalType,
    setSideNavOpen,
    setSearchFilters,
  };
}

