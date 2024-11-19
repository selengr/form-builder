import type { ReactNode, FC } from "react";
import {
  // MuiRtlProvider,
  ReactQueryClientProvider,
  NetworkProvider,
  MuiThemeProvider,
} from "@/providers";
import { Toaster } from "sonner";
import MainPanelLayout from "@/templates/layout/MainPanelLayout";

type TRootProvider = {
  readonly children: ReactNode;
};

const RootProvider: FC<TRootProvider> = ({ children }) => {
  return (
    <MuiThemeProvider>
      <ReactQueryClientProvider>
        <NetworkProvider>
          <Toaster richColors closeButton />
          {/* <MuiRtlProvider> */}
          <MainPanelLayout>{children}</MainPanelLayout>
          {/* </MuiRtlProvider> */}
        </NetworkProvider>
      </ReactQueryClientProvider>
    </MuiThemeProvider>
  );
};

export { RootProvider };
