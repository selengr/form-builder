import { ReactNode } from 'react';
import DesignerContextProvider from '@/context/DesignerContext';
import DesignerTabs from '@/templates/builder/TabComponent';

export default function BuilderIdPageLayout({ children }: { children: ReactNode }) {
  return   <div dir="ltr" className="flex w-full mx-auto h-[calc(100vh-1rem)]">
        <main className="flex flex-col w-full">
          <div className="flex w-full items-start justify-center relative h-full">
  
   <div className="w-full min-h-full px-4 py-4">

      <div className="bg-white w-full h-full lg:flex-row rounded-xl">
        <DesignerTabs />

  <DesignerContextProvider>{children}</DesignerContextProvider>;

     </div>
     </div>

     
     </div>
          </main>
        </div>
}
