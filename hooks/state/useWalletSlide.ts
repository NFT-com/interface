import useSWR from 'swr';

export function useWalletSlide() {
  const { data, mutate } = useSWR('walletSlide', { fallbackData: false });

  const loading = !data;

  const useWalletSlideToggle = () => {
    mutate(!data);
  };

  const setWalletSlideOpen = (open: boolean) => {
    mutate(open);
  };

  return {
    loading,
    walletSlideOpen: data,
    toggleWalletSlide: useWalletSlideToggle,
    setWalletSlideOpen,
  };
}