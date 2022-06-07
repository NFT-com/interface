import { getCurrentTimestamp } from 'utils/helpers';

import { useEffect } from 'react';
import useSWR from 'swr';

export interface UserState {
  isDarkMode: boolean;
  timestamp: number;
}

export const userStateInitial: UserState = {
  isDarkMode: true,
  timestamp: getCurrentTimestamp(),
};

export function useUser() {
  const { data, mutate } = useSWR('user', { fallbackData: userStateInitial });

  const loading = !data;
  const updateDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      isDarkMode: darkMode,
      timestamp: getCurrentTimestamp()
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(data?.isDarkMode ? 'light' : 'dark');
    root.classList.add(data?.isDarkMode ? 'dark' : 'light');
  }, [data?.isDarkMode]);

  return {
    user: data,
    loading,
    isDarkMode: data?.isDarkMode,
    timestamp: data?.timestamp,
    updateDarkMode,
  };
}