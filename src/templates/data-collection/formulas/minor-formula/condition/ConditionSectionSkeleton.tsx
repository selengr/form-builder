function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

function ComboSkeleton({ className = '', textWidth = 'w-20' }: { className?: string; textWidth?: string }) {
  return (
    <div
      className={`flex items-center justify-between h-[52px] shrink-0 rounded-xl border border-[#E8E8E8] bg-white ${className}`}
      style={{ padding: '0 14px' }}>
      <SkeletonBlock className={`h-4 ${textWidth}`} />
      <SkeletonBlock className="h-4 w-4 rounded" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full md:items-start" style={{ gap: 12, padding: '6px 14px' }}>
      <ComboSkeleton className="w-full md:w-[305px]" textWidth="w-28" />
      <ComboSkeleton className="w-full md:w-[122px]" textWidth="w-12" />
      <ComboSkeleton className="w-full md:w-[122px]" textWidth="w-14" />
      <div
        className="flex items-center md:flex-1 shrink-0 min-w-0 w-full h-[52px] rounded-xl border border-[#E8E8E8] bg-white"
        style={{ padding: '0 14px' }}>
        <SkeletonBlock className="h-4 w-16" />
      </div>
    </div>
  );
}

export default function ConditionSectionSkeleton() {
  return (
    <div
      dir="rtl"
      aria-busy="true"
      className="flex flex-col w-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
      <p
        className="text-[14px] bg-white border-b border-b-[#DDE1E6] font-medium text-right"
        style={{ padding: '10px 14px', color: '#9A9A9A' }}>
        اگر
      </p>

      <div style={{ paddingTop: 6 }}>
        <RowSkeleton />
      </div>

      <div className="flex items-center" style={{ gap: 8, padding: '8px 14px' }}>
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-3 w-6" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-3 w-6" />
        <div className="flex-1 border-t border-dashed border-[#E8E8E8]" />
      </div>

      <RowSkeleton />

      <div style={{ padding: '9px 14px 14px' }}>
        <div
          className="flex items-center justify-center w-full rounded-xl border border-dashed border-[#DDE1E6] bg-[#F8FAFC] text-sm font-medium"
          style={{ minHeight: 50, color: '#9A9A9A' }}>
          افزودن شرط جدید (و)
        </div>
      </div>
    </div>
  );
}
