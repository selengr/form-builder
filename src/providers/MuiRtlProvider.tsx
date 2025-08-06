'use client';

import type { FC, ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

type TRTLMuiProviders = {
  readonly children: ReactNode;
};

const cacheRTL = createCache({
  key: 'rtl-mui',
  stylisPlugins: [prefixer, rtlPlugin],
});

const MuiRtlProvider: FC<TRTLMuiProviders> = ({ children }) => {
  return <CacheProvider value={cacheRTL}>{children}</CacheProvider>;
};

export { MuiRtlProvider };
