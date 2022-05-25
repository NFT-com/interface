import useSWR from 'swr';

export function useSignOutDialog() {
  const { data, mutate } = useSWR('signOutDialog', { fallbackData: false });

  const loading = !data;

  const setSignOutDialogOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    signOutDialogOpen: data,
    setSignOutDialogOpen,
  };
}