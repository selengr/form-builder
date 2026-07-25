'use client';

import { useContext } from 'react';
import { DesignerContext } from '@/context/AllContexts';

export default function useDesigner() {
  const context = useContext(DesignerContext);

  if (context === null) {
    throw new Error('useDesigner must be used within a DesignerContext');
  }

  return context;
}
