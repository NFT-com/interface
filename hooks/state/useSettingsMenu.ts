import useSWR from 'swr';

export function useSettingsMenu() {
  const { data, mutate } = useSWR('settingsMenu', { fallbackData: false });

  const loading = !data;
  const useToggleSettingsMenu = () => {
    mutate(!data);
  };

  return {
    loading,
    settingsMenuOpen: data,
    useToggleSettingsMenu,
  };
}