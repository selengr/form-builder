function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

export default function MinorFormulaRowSkeleton() {
  return (
    <div
      dir="rtl"
      className="flex items-center gap-2 w-full h-[54px] shrink-0 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white">
      <div className="flex flex-col items-center justify-center gap-[3px] shrink-0">
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
      </div>

      <SkeletonBlock className="h-4 w-5 shrink-0 rounded" />

      <SkeletonBlock className="h-9 w-9 shrink-0 rounded-[10px] bg-gray-100" />

      <div className="flex-1 min-w-0 pr-2">
        <SkeletonBlock className="h-4 w-3/4 max-w-[180px]" />
      </div>

      <SkeletonBlock className="h-9 w-9 shrink-0 rounded-[10px]" />
    </div>
  );
}
