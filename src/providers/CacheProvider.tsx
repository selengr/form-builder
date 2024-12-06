"use client";

import { ReactNode } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

const CacheProviderRTL = ({ children }: { children: ReactNode }) => {
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
    prepend: true,
  });

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
};

export default CacheProviderRTL;
