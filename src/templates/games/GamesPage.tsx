'use client';

import GameCard from './GameCard';
import GamesHeader from './GamesHeader';
import { GAMES_CATALOG } from './catalog';

export default function GamesPage() {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3 pb-8">
      <GamesHeader title="بازی‌های شناختی" />
      <p className="text-sm text-[#637381] mb-4">
        تمرین‌های کوتاه برای حافظه، توجه و سرعت واکنش. نتیجه روی همین دستگاه ذخیره می‌شود.
      </p>
      <div className="flex flex-col gap-2">
        {GAMES_CATALOG.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
