import { BigNumber } from 'ethers';
import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
  currentProfileTokenId: BigNumber | null;
  hiddenProfile: string[];
}

export const userStateInitial: UserState = {
  isDarkMode: true,
  currentProfileUrl: '',
  currentProfileTokenId: (typeof window !== 'undefined')
    ? (localStorage.getItem('selectedProfileTokenId') ? BigNumber.from(localStorage.getItem('selectedProfileTokenId')) : null)
    : null,
  hiddenProfile: []
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

  const setCurrentProfileUrl = useCallback((selectedProfileUrl: string) => {
    mutate({
      ...data,
      currentProfileUrl: selectedProfileUrl
    });
    localStorage.setItem('selectedProfileUrl', selectedProfileUrl === '' ? '' : selectedProfileUrl);
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

  const setCurrentProfileTokenId = useCallback((selectedProfileTokenId: BigNumber | null) => {
    mutate({
      ...data,
      currentProfileTokenId: selectedProfileTokenId
    });
    localStorage.setItem('selectedProfileTokenId', !selectedProfileTokenId ? null : selectedProfileTokenId?.toString());
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
    setCurrentProfileTokenId,
    getCurrentProfileUrl,
    setHiddenProfileWithExpiry,
    getHiddenProfileWithExpiry
  };
}