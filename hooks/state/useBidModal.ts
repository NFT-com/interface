import useSWR from 'swr';

export function useBidModal() {
  const { data, mutate } = useSWR('bidModal', { fallbackData: false });

  const loading = !data;
  const useToggleBidModal = () => {
    mutate(!data);
  };

  const setBidModalOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    bidModalOpen: data,
    useToggleBidModal,
    setBidModalOpen,
  };
}