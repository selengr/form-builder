import { ReactNode } from 'react';
import BuilderLayoutShell from './BuilderLayoutShell';

export default function BuilderIdLayout({ children }: { children: ReactNode }) {
  return <BuilderLayoutShell>{children}</BuilderLayoutShell>;
}
