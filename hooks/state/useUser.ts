import { isNullOrEmpty } from 'utils/helpers';

import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
  hiddenProfile: string[];
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

  const setHiddenProfileWithExpiry = useCallback((profileToHide: string) => {
    const now = new Date();
    mutate({
      ...data,
      hiddenProfile: [profileToHide]
    });
    const item = {
      value: profileToHide,
      expiry: now.getTime() + 10000,
    };
    localStorage.setItem('hiddenProfile', JSON.stringify(item));
  }, [data, mutate]);

  const getHiddenProfileWithExpiry = useCallback(() => {
    const itemStr = localStorage.getItem('hiddenProfile');
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem('hiddenProfile');
      return null;
    }
    return item.value;
  }, []);

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
    getCurrentProfileUrl,
    setHiddenProfileWithExpiry,
    getHiddenProfileWithExpiry
  };
}