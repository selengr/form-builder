import { ReactNode } from 'react';
import DesignerContextProvider from '@/context/DesignerContext';

export default function BuilderIdPageLayout({ children }: { children: ReactNode }) {
  return <DesignerContextProvider>{children}</DesignerContextProvider>;
}
