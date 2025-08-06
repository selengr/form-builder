'use client';

import { useContext } from 'react';
import { ActionElementsContext } from '@/context/AllContexts';

export default function useActionElements() {
  const context = useContext(ActionElementsContext);

  if (context === null) {
    throw new Error('useActionElements must be used within a ActionElementsContext');
  }

  return context;
}
