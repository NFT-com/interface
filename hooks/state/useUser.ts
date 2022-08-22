import { UserNotifications } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback,useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  currentProfileUrl: string
  isDarkMode: boolean;
  hiddenProfile: string[];
  activeNotifications: UserNotifications;
}

export function useUser() {
  const { data, mutate } = useSWR('user', {
    fallbackData: {
      isDarkMode: false,
      currentProfileUrl: '',
      hiddenProfile: null,
      activeNotifications: {
        hasUnclaimedProfiles: false,
        hasPendingAssociatedProfiles: false,
        profileNeedsCustomization: false,
        associatedProfileAdded: false,
        associatedProfileRemoved: false,
      }
    }
  });

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

  const setUserNotificationActive = useCallback((notification: keyof UserNotifications, notificationValue: boolean) => {
    mutate({
      ...data,
      activeNotifications: {
        ...data.activeNotifications,
        [notification]: notificationValue
      }
    });
  } , [data, mutate]);

  const getNotificationCount = useCallback(() => {
    let count = 0;
    for (const key in data.activeNotifications) {
      if (data.activeNotifications[key]) {
        count++;
      }
    }
    return count;
  }, [data]);

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
    getHiddenProfileWithExpiry,
    setUserNotificationActive,
    getNotificationCount,
  };
}