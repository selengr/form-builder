'use client';

type ModalSize = 'small' | 'medium' | 'large' | 'full';

export function useIframeDetector() {
  if (typeof window === 'undefined') {
    return { isInIframe: false, modalSize: 'large' };
  }

  const isInIframe = window.self !== window.top;

  const width = window.innerWidth;
  const modalSize: ModalSize =
    width < 480 ? 'small' : width < 768 ? 'medium' : width < 1024 ? 'large' : 'full';

  return { isInIframe, modalSize };
}
