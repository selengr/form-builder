'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import GamesHeader from './GamesHeader';
import { getLastGameResult } from './resultsStore';
import type { GameCatalogItem, GameResultRecord } from './types';

export default function GameResult({ game }: { game: GameCatalogItem }) {
  const [record, setRecord] = useState<GameResultRecord | null>(null);

  useEffect(() => {
    const last = getLastGameResult();
    setRecord(last?.slug === game.slug ? last : null);
  }, [game.slug]);

  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3 pb-8">
      <GamesHeader title="نتیجه" backHref="/games" />
      <div className="border border-[#E8E8E8] rounded-xl bg-white p-5 text-center">
        <p className="text-sm text-[#637381] mb-1">{game.title}</p>
        <p className="text-4xl font-black text-[#1758BA] mb-2">{record ? record.score : '—'}</p>
        <p className="text-sm text-[#393939]">{record?.detail ?? 'نتیجه‌ای برای این بازی ذخیره نشده است.'}</p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Link href={`/games/${game.slug}/play`}>
          <Button fullWidth variant="contained" disableElevation sx={{ height: 48, borderRadius: '12px', bgcolor: '#1758BA' }}>
            دوباره بازی
          </Button>
        </Link>
        <Link href="/games">
          <Button fullWidth variant="outlined" sx={{ height: 48, borderRadius: '12px' }}>
            فهرست بازی‌ها
          </Button>
        </Link>
      </div>
    </div>
  );
}
