import { BigNumber } from 'ethers';
import { useCallback,useEffect } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export interface UserState {
  currentProfileTokenId: BigNumber | null;
  isDarkMode: boolean;
}

export const userStateInitial: UserState = {
  currentProfileTokenId: null,
  isDarkMode: true
};

export function useUser() {
  useAccount({
    onConnect({ isReconnected }) {
      if (isReconnected && !!data?.currentProfileTokenId) {
        setCurrentProfileTokenId(BigNumber.from(localStorage.getItem('selectedProfileTokenId')));
      } else {
        setCurrentProfileTokenId(null);
      }
    },
    onDisconnect() {
      console.log('disconnected');
      setCurrentProfileTokenId(null);
    },
  });
    
  const { data, mutate } = useSWR('user', { fallbackData: userStateInitial });

  const loading = !data;
  const setDarkMode = (darkMode: boolean) => {
    mutate({
      ...data,
      isDarkMode: darkMode
    });
  };

  const setCurrentProfileTokenId = useCallback((selectedProfileTokenId: BigNumber | null) => {
    mutate({
      ...data,
      currentProfileTokenId: selectedProfileTokenId
    });
    localStorage.setItem('selectedProfileTokenId', selectedProfileTokenId?.toString());
  }, [data, mutate]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(data?.isDarkMode ? 'light' : 'dark');
    root.classList.add(data?.isDarkMode ? 'dark' : 'light');
  }, [data?.isDarkMode]);

  return {
    user: data,
    loading,
    setDarkMode,
    setCurrentProfileTokenId,
  };
}