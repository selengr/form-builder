import { ReactNode } from 'react';
import BuilderLayoutShell from '@/features/form-builder/BuilderLayoutShell';

export default function BuilderIdLayout({ children }: { children: ReactNode }) {
  return <BuilderLayoutShell>{children}</BuilderLayoutShell>;
}
