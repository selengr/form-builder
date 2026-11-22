'use client';

const pulse = 'animate-pulse';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg ${pulse} ${className}`} />;
}

function AdminPackagingRequestCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="flex flex-col gap-3 w-full py-4 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white">
      <div className="flex items-center gap-2 min-h-[56px]">
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[10px] bg-gray-100" />
        <div className="flex-1 min-w-0 flex flex-col gap-2 pr-1">
          <SkeletonBlock className="h-4 w-3/4 max-w-[180px]" />
          <SkeletonBlock className="h-3 w-1/3 max-w-[88px] rounded-lg" />
        </div>
        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[10px]" />
      </div>

      <SkeletonBlock className="h-10 w-full rounded-[10px]" />
    </div>
  );
}

export default function AdminPackagingRequestListCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <AdminPackagingRequestCardSkeleton key={index} />
      ))}
    </>
  );
}
