import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
}

export const userStateInitial: UserState = {
  isDarkMode: true,
  currentProfileUrl: '',
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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(data?.isDarkMode ? 'light' : 'dark');
    root.classList.add(data?.isDarkMode ? 'dark' : 'light');
  }, [data?.isDarkMode]);

  return {
    user: data,
    loading,
    setDarkMode,
    setCurrentProfileUrl
  };
}