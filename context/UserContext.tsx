import { getCurrentTimestamp } from 'utils/helpers';

import { createContext,useCallback,useContext, useMemo, useState } from 'react';

interface UserContextData {
  userDarkMode: boolean | null;
  matchesDarkMode: boolean;
  timestamp: number;
  isSignedOut: boolean;
  updateUserDarkMode: (darkMode: boolean) => void;
  updateMatchesDarkMode: (matchesDarkMode: boolean) => void;
  updateIsSignedOut: (isSignedOut: boolean) => void;
}

export const userContextInitialState: UserContextData = {
  userDarkMode: null,
  matchesDarkMode: false,
  timestamp: getCurrentTimestamp(),
  isSignedOut: false,
  updateUserDarkMode: () => null,
  updateMatchesDarkMode: () => null,
  updateIsSignedOut: () => null
};

export const UserContext = createContext<UserContextData | undefined>(undefined);

export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if(!userContext) {
    throw new Error('useUserContext must be used within the UserContext Provider');
  }
  return userContext;
};

export const useUserContextValue = (): UserContextData => {
  const [userDarkMode, setUserDarkMode] = useState(userContextInitialState.userDarkMode);
  const [matchesDarkMode, setMatchesDarkMode] = useState(userContextInitialState.matchesDarkMode);
  const [timestamp, setTimestamp] = useState(userContextInitialState.timestamp);
  const [isSignedOut, setIsSignedOut] = useState(userContextInitialState.isSignedOut);

  const updateUserDarkMode = useCallback((darkMode: boolean | null) => {
    setUserDarkMode(darkMode);
    setTimestamp(getCurrentTimestamp());
  }, []);

  const updateMatchesDarkMode = useCallback((matchesDarkMode: boolean) => {
    setMatchesDarkMode(matchesDarkMode);
    setTimestamp(getCurrentTimestamp());
  }, []);

  const updateIsSignedOut = useCallback((isSignedOut: boolean) => {
    setIsSignedOut(isSignedOut);
    setTimestamp(getCurrentTimestamp());
  }, []);

  return useMemo(
    () => ({
      userDarkMode,
      matchesDarkMode,
      timestamp,
      isSignedOut,
      updateUserDarkMode,
      updateMatchesDarkMode,
      updateIsSignedOut
    }),
    [userDarkMode, matchesDarkMode, timestamp, isSignedOut, updateUserDarkMode, updateMatchesDarkMode, updateIsSignedOut]
  );
};

export default useUserContextValue;