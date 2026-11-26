'use client';

const pulse = 'animate-pulse';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg ${pulse} ${className}`} />;
}

function GameCardSkeletonItem() {
  return (
    <div
      dir="rtl"
      className="flex items-center gap-2 h-[88px] w-full py-4 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white">
      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[10px] bg-gray-100" />
      <div className="flex-1 min-w-0 flex flex-col gap-2 pr-1">
        <SkeletonBlock className="h-4 w-3/4 max-w-[180px]" />
        <SkeletonBlock className="h-3 w-1/3 max-w-[80px]" />
      </div>
      <SkeletonBlock className="h-7 w-12 rounded-lg" />
    </div>
  );
}

export default function GameCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: 6 }).map((_, index) => (
        <GameCardSkeletonItem key={index} />
      ))}
    </div>
  );
}
