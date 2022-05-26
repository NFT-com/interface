import useSWR from 'swr';

export function useKeyVideo() {
  const { data, mutate } = useSWR('keyVideo', { fallbackData: false });

  const loading = !data;
  
  const useKeyVideoToggle = () => {
    mutate(!data);
  };

  return {
    loading,
    keyVideoVisible: data,
    useKeyVideoToggle,
  };
}