import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';

import { useCallback,useEffect, useState } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
  hiddenProfile: string[];
}

export function useUser() {
  const [currentProfileId, setCurrentProfileId] = useState('');
  const { data, mutate } = useSWR('user', {
    fallbackData: {
      isDarkMode: false,
      currentProfileUrl: '',
      hiddenProfile: null,
    }
  });

  const { profileData } = useProfileQuery(data.currentProfileUrl);

  const loading = !data;
  const setDarkMode = useCallback((darkMode: boolean) => {
    if (!getEnvBool(Doppler.NEXT_PUBLIC_THEME_TOGGLE_ENABLED)) {
      return;
    }
    mutate({
      ...data,
      isDarkMode: darkMode
    });
  }, [data, mutate]);

  const setCurrentProfileUrl= useCallback((selectedProfileUrl: string | null) => {
    localStorage.setItem('selectedProfileUrl', isNullOrEmpty(selectedProfileUrl) ? '' : selectedProfileUrl);
    mutate({
      ...data,
      currentProfileUrl: selectedProfileUrl
    });
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

  useEffect(() => {
    setCurrentProfileId(profileData?.profile?.id ?? '');
  }, [profileData]);

  return {
    user: data,
    currentProfileId: currentProfileId,
    loading,
    setDarkMode,
    setCurrentProfileUrl,
    getCurrentProfileUrl,
    setHiddenProfileWithExpiry,
    getHiddenProfileWithExpiry,
  };
}
