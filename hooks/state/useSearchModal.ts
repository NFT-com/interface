import { CuratedCollection } from 'types';

import { useCallback } from 'react';
import useSWR from 'swr';

export function useSearchModal() {
  const { data, mutate } = useSWR('searchmodal', {
    fallbackData:
    {
      modalType: '',
      searchModalOpen: false,
      sideNavOpen: false,
      searchFilters: [],
      filtersList: null,
      checkedFiltersList: '',
      sortBy: '',
      clearedFilters: true,
      curatedCollections: null,
      selectedCuratedCollection: null,
      collectionPageSortyBy: '',
      id: '',
    } });

  const loading = !data;
  
  const useToggleSearchModal = () => {
    mutate({
      ...data,
      searchModalOpen: !data.searchModalOpen
    });
  };

  const setSearchModalOpen = useCallback((searchModalOpen: boolean, modalType = 'search', searchFilters?: any) => {
    console.log(data, 'data modal open false');
    const filtersList = modalType !== 'collectionFilters' ?
      data.filtersList ?? (searchModalOpen && searchFilters?.map((item) => {
        return {
          filter: item.field_name,
          values: []
        };
      }))
      : [];
    mutate({
      ...data,
      searchModalOpen,
      modalType,
      searchFilters,
      filtersList,
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

  const setCuratedCollections = useCallback((curatedCollections: CuratedCollection[]) => {
    mutate({
      ...data,
      curatedCollections
    });
  },[data, mutate]);

  const setSelectedCuratedCollection = useCallback((selectedCuratedCollection: CuratedCollection) => {
    mutate({
      ...data,
      selectedCuratedCollection
    });
  },[data, mutate]);

  const setCollectionPageAppliedFilters = useCallback((collectionPageSortyBy: string, id: string, searchModalOpen = true) => {
    mutate({
      ...data,
      searchModalOpen,
      id,
      collectionPageSortyBy
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
    curatedCollections: data.curatedCollections,
    selectedCuratedCollection: data.selectedCuratedCollection,
    collectionPageSortyBy: data.collectionPageSortyBy,
    id: data.id,
    toggleSearchModal: useToggleSearchModal,
    setSearchModalOpen,
    setModalType,
    setSideNavOpen,
    setCheckedFiltersList,
    setSortBy,
    setClearedFilters,
    setSearchFilters,
    setCuratedCollections,
    setSelectedCuratedCollection,
    setCollectionPageAppliedFilters
  };
}

