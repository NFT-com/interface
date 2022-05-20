import useSWR from 'swr';

export function useAddNFTModal() {
  const { data, mutate } = useSWR('addNFTModal', { fallbackData: false });

  const loading = !data;
  const useToggleAddNFTModal = () => {
    mutate(!data);
  };

  return {
    loading,
    addNFTModalOpen: data,
    useToggleAddNFTModal,
  };
}