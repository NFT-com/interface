import { useUser } from 'hooks/state/useUser';

import { useEffect } from 'react';

export default function DarkModeQueryParamReader() {
  const { updateDarkMode } = useUser();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    updateDarkMode(prefersDark);
  }, [updateDarkMode]);
  return null;
}