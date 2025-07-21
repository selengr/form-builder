"use client";

import type {FC, ReactNode} from "react";
import {MuiRtlProvider, MuiThemeProvider, NetworkProvider, ReactQueryClientProvider,} from "@/providers";
import {Toaster} from "sonner";
import MainPanel from "@/templates/layout/MainPanel";
import {SessionProvider} from "next-auth/react";

type TRootProvider = {
  readonly children: ReactNode;
};

const RootProvider: FC<TRootProvider> = ({children}) => {
  return (
    <SessionProvider>
      <MuiThemeProvider>
        <ReactQueryClientProvider>
          <Toaster richColors
                   closeButton dir="rtl"
                   duration={20000}
                   swipeDirections={["top", "bottom"]}
                   expand={false}
                   visibleToasts={1} theme={"light"}
          />
          <NetworkProvider>
            <MuiRtlProvider>
              <MainPanel>{children}</MainPanel>
            </MuiRtlProvider>
          </NetworkProvider>
        </ReactQueryClientProvider>
      </MuiThemeProvider>
    </SessionProvider>
  );
};

export {RootProvider};
