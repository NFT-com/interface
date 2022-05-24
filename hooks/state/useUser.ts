import { getCurrentTimestamp } from 'utils/helpers';

import useSWR from 'swr';

export interface UserState {
  userDarkMode: boolean | null;
  matchesDarkMode: boolean;
  timestamp: number;
}

export const userStateInitial: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  timestamp: getCurrentTimestamp(),
};

export function useUser() {
  const { data, mutate } = useSWR('user', { fallbackData: userStateInitial });

  const loading = !data;
  const updateDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      userDarkMode: darkMode,
      timestamp: getCurrentTimestamp()
    });
  };

  return {
    user: data,
    loading,
    userDarkMode: data?.userDarkMode,
    matchesDarkMode: data?.matchesDarkMode,
    timestamp: data?.timestamp,
    updateDarkMode,
  };
}