import useSWR from 'swr';

export function useSidebar() {
  const { data, mutate } = useSWR('heroSidebar', { fallbackData: false });

  const loading = !data;
  const useToggleSidebar = () => {
    mutate(!data);
  };

  const setSidebarOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    sidebarOpen: data,
    toggleSidebar: useToggleSidebar,
    setSidebarOpen,
  };
}

