import { ReactNode } from 'react';
import DesignerContextProvider from '@/context/DesignerContext';
import DesignerTabs from '@/templates/builder/TabComponent';

export default function BuilderIdLayout({ children }: { children: ReactNode }) {
  return <div dir="ltr" className="flex w-full mx-auto min-h-[calc(100vh-1rem)]">
    <main className="flex flex-col w-full">
      <div className="flex w-full px-3 py-2 items-start justify-center relative flex-1">

        {/* <div className="w-full px-3 py-2 flex-1"> */}
          <div className="bg-white w-full min-h-full rounded-xl flex flex-col pb-2">
            <DesignerTabs />
            <DesignerContextProvider>{children}</DesignerContextProvider>
          </div>
        </div>
      {/* </div> */}
    </main>
  </div>
}