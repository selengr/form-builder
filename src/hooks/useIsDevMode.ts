'use client';

import { useEffect, useState } from 'react';

export const DEV_MODE_PARAM = 'mode';
export const DEV_MODE_VALUE = 'dev';

export function useIsDevMode() {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    setIsDevMode(new URLSearchParams(window.location.search).get(DEV_MODE_PARAM) === DEV_MODE_VALUE);
  }, []);

  return isDevMode;
}
