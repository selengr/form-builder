import { ReactNode } from 'react';
import BuilderLayoutShell from '@/app/(builder)/builder/[id]/BuilderLayoutShell';

export default function BuilderNewIdLayout({ children }: { children: ReactNode }) {
  return <BuilderLayoutShell>{children}</BuilderLayoutShell>;
}
