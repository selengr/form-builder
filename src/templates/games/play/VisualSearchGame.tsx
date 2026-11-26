'use client';

import { useMemo, useState } from 'react';
import { useFinishGame } from '../useFinishGame';

function makeBoard(round: number) {
  const size = round < 4 ? 16 : 25;
  const oddIndex = Math.floor(Math.random() * size);
  return { size, oddIndex, glyph: round % 2 === 0 ? '○' : '□', oddGlyph: round % 2 === 0 ? '●' : '■' };
}

export default function VisualSearchGame() {
  const finish = useFinishGame();
  const [round, setRound] = useState(1);
  const [hits, setHits] = useState(0);
  const board = useMemo(() => makeBoard(round), [round]);
  const cols = board.size === 16 ? 4 : 5;

  const pick = (index: number) => {
    const success = index === board.oddIndex;
    const nextHits = hits + (success ? 1 : 0);
    if (round >= 8) {
      finish({
        slug: 'visual-search',
        title: 'جست‌وجوی دیداری',
        score: Math.round((nextHits / 8) * 100),
        detail: `${nextHits} هدف درست از ۸`,
      });
      return;
    }
    setHits(nextHits);
    setRound(round + 1);
  };

  return (
    <div>
      <p className="text-sm text-[#637381] mb-2">شکل متفاوت را پیدا کنید.</p>
      <p className="text-sm mb-3">دور {round} از ۸</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: board.size }).map((_, index) => (
          <button
            key={`${round}-${index}`}
            type="button"
            onClick={() => pick(index)}
            className="h-12 rounded-xl border border-[#E8E8E8] bg-white text-xl">
            {index === board.oddIndex ? board.oddGlyph : board.glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
