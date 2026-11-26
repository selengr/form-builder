'use client';

import Link from 'next/link';
import { HiOutlinePuzzlePiece } from 'react-icons/hi2';
import { InfoRow } from '@/components/common/infoRow';
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from './labels';
import type { GameCatalogItem } from './types';

export default function GameCard({ game }: { game: GameCatalogItem }) {
  return (
    <Link href={`/games/${game.slug}`} className="block">
      <div
        dir="rtl"
        className="flex items-center gap-2 min-h-[88px] w-full py-4 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <span className="rounded-[10px] h-10 w-10 flex justify-center items-center shrink-0 bg-[#F7F7FF]">
          <HiOutlinePuzzlePiece size={24} className="text-[#1758BA]" />
        </span>

        <div className="flex-1 min-w-0 flex flex-col gap-1 pr-1">
          <InfoRow
            label="نام"
            value={<span className="truncate block">{game.title}</span>}
            bold
            className="min-w-0"
          />
          <InfoRow label="دسته" value={CATEGORY_LABEL[game.category]} bold />
          <p className="text-xs text-[#637381] truncate">{game.summary}</p>
        </div>

        <span className="shrink-0 text-[11px] font-bold text-[#1758BA] bg-[#F7F7FF] rounded-lg px-2 py-1">
          {DIFFICULTY_LABEL[game.difficulty]}
        </span>
      </div>
    </Link>
  );
}
