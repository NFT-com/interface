import useSWR from 'swr';

export function useHeroSidebar() {
  const { data, mutate } = useSWR('heroSidebar', { fallbackData: false });

  const loading = !data;
  const useToggleHeroSidebar = () => {
    mutate(!data);
  };

  const setHeroSidebarOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    heroSidebarOpen: data,
    useToggleHeroSidebar,
    setHeroSidebarOpen,
  };
}

