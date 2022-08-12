import { useCallback } from 'react';
import useSWR from 'swr';

export function useSignOutDialog() {
  const { data, mutate } = useSWR('signOutDialog', { fallbackData: false });

  const loading = !data;

  const setSignOutDialogOpen = useCallback((open: boolean) => {
    mutate(open);
  }, [mutate]);

  return {
    loading,
    signOutDialogOpen: data,
    setSignOutDialogOpen,
  };
}