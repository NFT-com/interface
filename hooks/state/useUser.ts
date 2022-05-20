import { getCurrentTimestamp } from 'utils/helpers';

import useSWR from 'swr';

export type UserAuthSignature = {
  address: string;
  authSignature: string;
  signIn: boolean;
};

export interface UserState {
  userDarkMode: boolean | null;
  matchesDarkMode: boolean;
  timestamp: number;
  isSignedIn: boolean;
  signature: UserAuthSignature | null;
}

export const userStateInitial: UserState = {
  userDarkMode: null,
  matchesDarkMode: false,
  timestamp: getCurrentTimestamp(),
  isSignedIn: false,
  signature: null,
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

  const updateIsSignedIn = (isSignedIn: boolean) => {
    mutate({
      ...data,
      isSignedIn,
      timestamp: getCurrentTimestamp()
    });
  };

  const setUserSignature = (signature: UserAuthSignature) => {
    mutate({
      ...data,
      signature,
      timestamp: getCurrentTimestamp(),
    });
  };

  return {
    user: data,
    loading,
    userDarkMode: data?.userDarkMode,
    matchesDarkMode: data?.matchesDarkMode,
    timestamp: data?.timestamp,
    signature: data?.signature,
    updateIsSignedIn,
    setUserSignature,
    updateDarkMode,
  };
}