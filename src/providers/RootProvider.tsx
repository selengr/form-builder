'use client';

import type { ReactNode } from 'react';
import {
  MuiRtlProvider,
  MuiThemeProvider,
  NetworkProvider,
  ReactQueryClientProvider,
} from '@/providers';
import { Toaster } from 'sonner';
import MainPanel from '@/templates/layout/MainPanel';
import { SessionProvider } from 'next-auth/react';
import { type IUserInfoResponse } from '@actions/auth';

type RootProviderProps = {
  children: ReactNode;
  initialUserInfo: IUserInfoResponse | null;
};

export function RootProvider({ children }: RootProviderProps) {
  return (
    <MuiThemeProvider>
      <MuiRtlProvider>
        <ReactQueryClientProvider>
          <SessionProvider>
            <NetworkProvider>

              <Toaster
                richColors
                closeButton
                dir="rtl"
                duration={20000}
                swipeDirections={['top', 'bottom']}
                expand={false}
                visibleToasts={1}
                theme="light"
              />

              <MainPanel>{children}</MainPanel>

            </NetworkProvider>
          </SessionProvider>
        </ReactQueryClientProvider>
      </MuiRtlProvider>
    </MuiThemeProvider>
  );
}
