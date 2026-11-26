'use client';

import { useMemo, useState } from 'react';
import ImmediateSearchInput from '@/components/ListGrid/ImmediateSearchInput';
import GameCard from './GameCard';
import GamesHeader from './GamesHeader';
import { filterGamesCatalog } from './filterCatalog';
import { CATEGORY_LABEL } from './labels';
import type { GameCategory } from './types';

const CATEGORY_FILTERS: Array<GameCategory | 'all'> = ['all', 'memory', 'attention', 'speed'];

export default function GamesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GameCategory | 'all'>('all');
  const games = useMemo(() => filterGamesCatalog(query, category), [query, category]);

  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3 pb-8">
      <GamesHeader title="بازی‌های شناختی" />
      <p className="text-sm text-[#637381] mb-3">
        تمرین‌های کوتاه برای حافظه، توجه و سرعت واکنش. نتیجه روی همین دستگاه ذخیره می‌شود.
      </p>

      <div className="mb-3">
        <ImmediateSearchInput onSearch={setQuery} />
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {CATEGORY_FILTERS.map((item) => {
          const selected = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold border ${
                selected ? 'bg-[#1758BA] text-white border-[#1758BA]' : 'bg-white text-[#393939] border-[#E8E8E8]'
              }`}>
              {item === 'all' ? 'همه' : CATEGORY_LABEL[item]}
            </button>
          );
        })}
      </div>

      {games.length === 0 ? (
        <p className="text-sm text-[#637381] text-center py-8">بازی‌ای با این جستجو پیدا نشد.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
