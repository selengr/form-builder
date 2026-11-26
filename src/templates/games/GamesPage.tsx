'use client';

import GamesHeader from './GamesHeader';
import { GAMES_CATALOG } from './catalog';

export default function GamesPage() {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3">
      <GamesHeader title="بازی‌های شناختی" />
      <p className="text-sm text-[#637381] mb-4">
        تمرین‌های کوتاه برای حافظه، توجه و سرعت واکنش. نتیجه روی همین دستگاه ذخیره می‌شود.
      </p>
      <p className="text-sm text-[#393939]">{GAMES_CATALOG.length} بازی آماده است.</p>
    </div>
  );
}
