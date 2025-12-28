'use client';

import { useEffect, useState } from 'react';

export function useIframeDetector() {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  return isInIframe;
}