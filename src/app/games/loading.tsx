import GamesHeader from '@/templates/games/GamesHeader';
import GameCardSkeleton from '@/templates/games/GameCardSkeleton';

export default function GamesLoading() {
  return (
    <div className="w-full max-w-[470px] mx-auto px-4 py-3">
      <GamesHeader title="بازی‌های شناختی" />
      <GameCardSkeleton />
    </div>
  );
}
