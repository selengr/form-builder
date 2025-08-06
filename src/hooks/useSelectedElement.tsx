'use client';

import { useContext } from 'react';
import { SelectedElementContext } from '@/context/AllContexts';

export default function useSelectedElement() {
  const context = useContext(SelectedElementContext);

  if (context === null) {
    throw new Error('useSelectedElement must be used within a SelectedElementContext');
  }

  return context;
}
