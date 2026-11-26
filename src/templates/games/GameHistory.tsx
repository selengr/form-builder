'use client';

import { useEffect, useState } from 'react';
import { getGameHistory } from './resultsStore';
import type { GameResultRecord } from './types';

export default function GameHistory() {
  const [items, setItems] = useState<GameResultRecord[]>([]);

  useEffect(() => {
    setItems(getGameHistory().slice(0, 5));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold text-[#161616] mb-2">آخرین نتایج این دستگاه</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-[#E8E8E8] rounded-xl bg-white px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{item.title}</p>
              <p className="text-xs text-[#637381]">{item.detail}</p>
            </div>
            <span className="text-sm font-black text-[#1758BA]">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
