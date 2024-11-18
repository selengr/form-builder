import type { ReactNode, FC } from "react";
import {
  MuiRtlProvider,
  ReactQueryClientProvider,
  MuiThemeProvider,
  NetworkProvider,
} from "@/providers";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

type TRootProvider = {
  readonly children: ReactNode;
};

const RootProvider: FC<TRootProvider> = ({ children }) => {
  return (
    <MuiThemeProvider>
      <ReactQueryClientProvider>
        <NetworkProvider>
          <Toaster richColors closeButton />
          <NextTopLoader showSpinner={false} />
          <MuiRtlProvider>{children}</MuiRtlProvider>
        </NetworkProvider>
      </ReactQueryClientProvider>
    </MuiThemeProvider>
  );
};

export { RootProvider };
