'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import { InfoRow } from '@/components/common/infoRow';
import GamesHeader from './GamesHeader';
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from './labels';
import type { GameCatalogItem } from './types';

export default function GameIntro({ game }: { game: GameCatalogItem }) {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3 pb-8">
      <GamesHeader title={game.title} backHref="/games" />

      <div className="border border-[#E8E8E8] rounded-xl bg-white p-4 flex flex-col gap-3">
        <InfoRow label="دسته" value={CATEGORY_LABEL[game.category]} bold />
        <InfoRow label="سطح" value={DIFFICULTY_LABEL[game.difficulty]} bold />
        <InfoRow label="زمان تقریبی" value={game.durationLabel} bold />
        <p className="text-sm text-[#637381] leading-7">{game.summary}</p>
      </div>

      <Link href={`/games/${game.slug}/play`} className="block mt-4">
        <Button
          fullWidth
          variant="contained"
          disableElevation
          sx={{ height: 48, borderRadius: '12px', fontWeight: 700, bgcolor: '#1758BA' }}>
          شروع بازی
        </Button>
      </Link>
    </div>
  );
}
