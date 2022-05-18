import useSWR from 'swr';

export default function useBidModal() {
  const { data, mutate } = useSWR('bidModal', { fallbackData: false });

  const loading = !data;
  const useToggleBidModal = () => {
    mutate(!data);
  };

  const setBidModal = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    bidModalOpen: data,
    useToggleBidModal,
    setBidModal,
  };
}