import { isNullOrEmpty } from 'utils/helpers';

import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
}

export function useUser() {
  const { data, mutate } = useSWR('user', {
    fallbackData: {
      isDarkMode: true,
      currentProfileUrl: '',
    }
  });

  const loading = !data;
  const setDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      isDarkMode: darkMode
    });
  };

  const setCurrentProfileUrl= useCallback((selectedProfileUrl: string | null) => {
    mutate({
      ...data,
      currentProfileUrl: selectedProfileUrl
    });
    localStorage.setItem('selectedProfileUrl', isNullOrEmpty(selectedProfileUrl) ? '' : selectedProfileUrl);
  }, [data, mutate]);

  const getCurrentProfileUrl = useCallback(() => {
    return typeof window !== 'undefined' ? localStorage?.getItem('selectedProfileUrl') : '';
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(data?.isDarkMode ? 'light' : 'dark');
    root.classList.add(data?.isDarkMode ? 'dark' : 'light');
  }, [data?.isDarkMode]);

  const result = typeof window !== 'undefined' ? localStorage?.getItem('selectedProfileUrl') : '';

  useEffect(() => {
    setCurrentProfileUrl(result);
  }, [setCurrentProfileUrl, result]);

  return {
    user: data,
    loading,
    setDarkMode,
    setCurrentProfileUrl,
    getCurrentProfileUrl
  };
}