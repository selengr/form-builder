'use client';

import { FC, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type TNetworkProvider = {
  readonly children: ReactNode;
};

const NetworkProvider: FC<TNetworkProvider> = ({ children }) => {
  useEffect(() => {
    const handleOnline = () => toast.success('اینترنت متصل شد');
    const handleOffline = () => toast.error('اینترنت قطع شده است');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{children}</>;
};

export { NetworkProvider };
