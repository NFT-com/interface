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

  const setSideNavOpen = (sideNavOpen: boolean) => {
    mutate({
      ...data,
      sideNavOpen,
    });
  };

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

