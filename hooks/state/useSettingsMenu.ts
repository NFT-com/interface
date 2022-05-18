import useSWR from 'swr';

export default function useSettingsMenu() {
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