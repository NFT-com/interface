import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', {
    fallbackData:
    {
      modalType: 'search',
      searchModalOpen: false,
      sideNavOpen: false,
      searchFilters: [],
      filtersList: null,
      checkedFiltersList: '',
      sortBy: '',
      clearedFilters: true,
    } });

  const loading = !data;
  
  const useToggleSearchModal = () => {
    mutate({
      ...data,
      searchModalOpen: !data.searchModalOpen
    });
  };

  const setSearchModalOpen = useCallback((searchModalOpen: boolean, modalType = 'search', searchFilters?: any) => {
    const filtersList = data.filtersList ?? (searchModalOpen && searchFilters.map((item) => {
      return {
        filter: item.field_name,
        values: []
      };
    }));
    mutate({
      ...data,
      searchModalOpen,
      modalType,
      searchFilters,
      filtersList
    });
  }, [data, mutate]);

  const setSearchFilters = useCallback((searchFilters: any) => {
    const filtersList = data.filtersList ?? (searchFilters?.map((item) => {
      return {
        filter: item.field_name,
        values: []
      };
    }));
    mutate({
      ...data,
      filtersList,
      searchFilters
    });
  },[data, mutate]);

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

  const setCheckedFiltersList = useCallback((checkedFiltersList: string) => {
    mutate({
      ...data,
      checkedFiltersList
    });
  },[data, mutate]);

  const setSortBy = useCallback((sortBy: string) => {
    mutate({
      ...data,
      sortBy
    });
  },[data, mutate]);

  const setClearedFilters = useCallback((clearedFilters: boolean) => {
    const filtersList = !clearedFilters
      ? data.filtersList
      : data.filtersList.map((item) => {
        return {
          filter: item.field_name,
          values: []
        };
      });
    mutate({
      ...data,
      filtersList,
      clearedFilters
    });
  },[data, mutate]);

  return {
    loading,
    modalType: data.modalType,
    searchModalOpen: data.searchModalOpen,
    sideNavOpen: data.sideNavOpen,
    searchFilters: data.searchFilters,
    filtersList: data.filtersList,
    checkedFiltersList: data.checkedFiltersList,
    sortBy:data.sortBy,
    clearedFilters: data.clearedFilters,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
    setModalType,
    setSideNavOpen,
    setCheckedFiltersList,
    setSortBy,
    setClearedFilters,
    setSearchFilters
  };
}

