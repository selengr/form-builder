'use client';

import { ReactNode } from 'react';
import DesignerContextProvider from '@/context/DesignerContext';

export default function BuilderLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div
      dir="ltr"
      className="flex w-full mx-auto overflow-hidden xs:h-[calc(100dvh-5rem)] md:h-[100dvh]"
    >
      <main className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex w-full px-3 py-2 items-start justify-center relative flex-1 overflow-hidden">
          <div className="bg-white w-full h-full rounded-xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0">
              <DesignerContextProvider>{children}</DesignerContextProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
