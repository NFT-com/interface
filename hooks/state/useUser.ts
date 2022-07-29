import { BigNumber } from 'ethers';
import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
  currentProfileTokenId: BigNumber | null;
}

export const userStateInitial: UserState = {
  isDarkMode: true,
  currentProfileUrl: '',
  currentProfileTokenId: (typeof window !== 'undefined')
    ? (localStorage.getItem('selectedProfileTokenId') ? BigNumber.from(localStorage.getItem('selectedProfileTokenId')) : null)
    : null,
};

export function useUser() {
  const { data, mutate } = useSWR('user', { fallbackData: userStateInitial });

  const loading = !data;
  const setDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      isDarkMode: darkMode
    });
  };

  const setCurrentProfileUrl= useCallback((selectedProfileUrl: string) => {
    mutate({
      ...data,
      currentProfileUrl: selectedProfileUrl
    });
    localStorage.setItem('selectedProfileUrl', selectedProfileUrl === '' ? '' : selectedProfileUrl);
  }, [data, mutate]);

  const setCurrentProfileTokenId = useCallback((selectedProfileTokenId: BigNumber | null) => {
    mutate({
      ...data,
      currentProfileTokenId: selectedProfileTokenId
    });
    localStorage.setItem('selectedProfileTokenId', !selectedProfileTokenId ? null : selectedProfileTokenId?.toString());
  }, [data, mutate]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(data?.isDarkMode ? 'light' : 'dark');
    root.classList.add(data?.isDarkMode ? 'dark' : 'light');
  }, [data?.isDarkMode]);

  return {
    user: data,
    loading,
    setDarkMode,
    setCurrentProfileUrl,
    setCurrentProfileTokenId,
  };
}