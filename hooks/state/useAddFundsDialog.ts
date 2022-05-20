import useSWR from 'swr';

export function useAddFundsDialog() {
  const { data, mutate } = useSWR('addFundsDialog', { fallbackData: false });

  const loading = !data;
  const useToggleAddFundsDialog = () => {
    mutate(!data);
  };

  const setAddFundsDialogOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    addFundsDialogOpen: data,
    useToggleAddFundsDialog,
    setAddFundsDialogOpen,
  };
}
