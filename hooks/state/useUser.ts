import { getCurrentTimestamp } from 'utils/helpers';

import useSWR from 'swr';

interface UserState {
  userDarkMode: boolean | null;
  matchesDarkMode: boolean;
  timestamp: number;
  isSignedOut: boolean;
}

export const userStateInitial: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  timestamp: getCurrentTimestamp(),
  isSignedOut: false,
};

export default function useUser() {
  const { data, mutate } = useSWR('user', { fallbackData: userStateInitial });

  const loading = !data;
  const updateDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      userDarkMode: darkMode,
      timestamp: getCurrentTimestamp()
    });
  };

  const updateIsSignedOut = (isSignedOut: boolean) => {
    mutate({
      ...data,
      isSignedOut,
      timestamp: getCurrentTimestamp()
    });
  };

  return {
    loading,
    userDarkMode: data?.userDarkMode,
    matchesDarkMode: data?.matchesDarkMode,
    timestamp: data?.timestamp,
    isSignedOut: data?.isSignedOut,
    updateDarkMode,
    updateIsSignedOut,
  };
}