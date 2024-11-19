import type { ReactNode, FC } from "react";
import {
  MuiRtlProvider,
  ReactQueryClientProvider,
  NetworkProvider,
  MuiThemeProvider,
} from "@/providers";
import { Toaster } from "sonner";
import MainPanel from "@/templates/layout/MainPanel";

type TRootProvider = {
  readonly children: ReactNode;
};

const RootProvider: FC<TRootProvider> = ({ children }) => {
  return (
    <MuiThemeProvider>
      <ReactQueryClientProvider>
        <NetworkProvider>
          <Toaster richColors closeButton />
          <MuiRtlProvider>
            <MainPanel>{children}</MainPanel>
          </MuiRtlProvider>
        </NetworkProvider>
      </ReactQueryClientProvider>
    </MuiThemeProvider>
  );
};

export { RootProvider };
