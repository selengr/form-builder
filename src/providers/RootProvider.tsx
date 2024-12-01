"use client";

import type { ReactNode, FC } from "react";
import {
  MuiRtlProvider,
  ReactQueryClientProvider,
  NetworkProvider,
  MuiThemeProvider,
} from "@/providers";
import { Toaster } from "sonner";
import MainPanel from "@/templates/layout/MainPanel";
// import { SessionProvider } from "next-auth/react";

type TRootProvider = {
  readonly children: ReactNode;
};

const RootProvider: FC<TRootProvider> = ({ children }) => {
  return (
    // <SessionProvider>
    <MuiThemeProvider>
      <ReactQueryClientProvider>
        <Toaster richColors closeButton dir="rtl" />
        <NetworkProvider>
          <MuiRtlProvider>
            <MainPanel>{children}</MainPanel>
          </MuiRtlProvider>
        </NetworkProvider>
      </ReactQueryClientProvider>
    </MuiThemeProvider>
    // </SessionProvider>
  );
};

export { RootProvider };
