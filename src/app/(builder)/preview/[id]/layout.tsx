import { ReactNode } from 'react';
import { PreviewProvider } from '@/context/PreviewContext';

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <PreviewProvider>{children}</PreviewProvider>
}
