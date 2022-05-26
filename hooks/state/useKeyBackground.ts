import useSWR from 'swr';

export interface IKeyBackground {
  img: string;
  bg: 'black' | 'white';
}

export const keyBackgroundFallback: IKeyBackground = {
  img: '',
  bg: 'black'
};


export function useKeyBackground() {
  const { data, mutate } = useSWR('keyBackground', { fallbackData: keyBackgroundFallback });
  
  const loading = !data;

  const setKeyBackground = (img: string, bg: 'black' | 'white') => {
    mutate({
      ...data,
      img,
      bg
    });
  };

  return {
    loading,
    img: data.img,
    bg: data.bg,
    setKeyBackground
  };
}