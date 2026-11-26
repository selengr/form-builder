'use client';

import { useRouter } from 'next/navigation';
import { saveGameResult } from './resultsStore';
import type { GameSlug } from './types';

export function useFinishGame() {
  const router = useRouter();

  return (payload: { slug: GameSlug; title: string; score: number; detail: string }) => {
    saveGameResult(payload);
    router.push(`/games/${payload.slug}/result`);
  };
}
