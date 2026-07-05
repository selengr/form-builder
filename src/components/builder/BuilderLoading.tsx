import { Fragment } from 'react';

const pulse = 'animate-pulse';

function SkeletonBlock({
  className = '',
}: {
  className?: string;
}) {
  return <div className={`bg-gray-200 rounded-lg ${pulse} ${className}`} />;
}

function HeaderSkeleton() {
  return (
    <>
      {/* Desktop header — lg+ */}
      <div
        dir="rtl"
        className={`hidden lg:flex items-center justify-between w-full px-1 pb-3 pr-5 pt-1 shrink-0 ${pulse}`}
      >
        <SkeletonBlock className="h-5 w-40 rounded-md" />
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-8 w-8 rounded-[10px]" />
          <SkeletonBlock className="h-8 w-8 rounded-[10px]" />
          <SkeletonBlock className="h-8 w-[132px] rounded-xl" />
        </div>
      </div>

      {/* Mobile header */}
      <div
        dir="rtl"
        className={`flex lg:hidden items-center justify-between w-full px-1 pb-3 shrink-0 relative ${pulse}`}
      >
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="absolute left-1/2 -translate-x-1/2 h-5 w-36 rounded-md" />
        <div className="w-10" />
      </div>
    </>
  );
}

function TabsSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex w-full gap-6 ${compact ? 'justify-center' : 'justify-between px-2'} ${pulse}`}>
      <div className="flex flex-col items-center gap-1 flex-1 max-w-[40%]">
        <SkeletonBlock className={`h-4 w-14 ${compact ? 'w-12' : ''}`} />
        <SkeletonBlock className="h-[3px] w-full rounded-full bg-gray-100" />
      </div>
      <div className="flex flex-col items-center gap-1 flex-1 max-w-[40%]">
        <SkeletonBlock className={`h-4 w-16 ${compact ? 'w-14' : ''}`} />
        <SkeletonBlock className="h-[3px] w-full rounded-full bg-[#1758BA]/30" />
      </div>
    </div>
  );
}

function QuestionCardSkeleton() {
  return (
    <div
      dir="rtl"
      className={`flex items-center gap-2 h-[72px] w-full py-3 pl-3 pr-2 border border-[#E8E8E8] rounded-xl bg-white`}
    >
      <div className="flex flex-col items-center justify-center gap-[3px] shrink-0 pl-2">
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
        <SkeletonBlock className="h-[2px] w-[14px] rounded-full" />
      </div>

      <SkeletonBlock className="h-4 w-5 shrink-0 rounded" />

      <SkeletonBlock className="h-9 w-9 shrink-0 rounded-[10px] bg-gray-100" />

      <div className="flex-1 min-w-0 flex flex-col gap-2 pr-2">
        <SkeletonBlock className="h-4 w-3/4 max-w-[180px]" />
        <SkeletonBlock className="h-3 w-1/3 max-w-[80px]" />
      </div>

      <div className="flex items-center gap-1 shrink-0 pl-1">
        <SkeletonBlock className="h-9 w-9 rounded-[10px]" />
        <SkeletonBlock className="h-9 w-9 rounded-[10px]" />
      </div>
    </div>
  );
}

function KanbanBoardSkeleton() {
  return (
    <div
      className={`flex flex-col w-full h-full min-h-[320px] rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden`}
    >
      <div className="flex flex-col w-full px-3 pt-3 gap-2">
        {[1, 2, 3].map((index) => (
          <QuestionCardSkeleton key={index} />
        ))}
      </div>

      <div className="mx-3 mb-3 mt-2 flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px]">
        <SkeletonBlock className="h-4 w-48 max-w-[80%] rounded-md bg-gray-100" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div
      dir="rtl"
      className={`hidden lg:flex bg-white rounded-[20px] sticky top-4 w-[340px] max-w-[340px] shrink-0 border border-[#DDE1E6] flex-col overflow-hidden select-none ${pulse}`}
      style={{ maxHeight: 'calc(100dvh - 120px)' }}
    >
      <div
        className="flex flex-col gap-2 p-2 overflow-hidden flex-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            dir="rtl"
            className="w-full flex items-center gap-3 rounded-xl h-[52px] px-2 bg-[#F7F7FF]/60 border border-[#E8E8E8]"
          >
            <SkeletonBlock className="h-9 w-9 shrink-0 rounded-[10px] bg-white" />
            <SkeletonBlock className="h-4 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileBottomBarSkeleton() {
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 md:right-[500px] z-50 bg-white border-t border-[#E8E8E8] px-4 py-3 flex items-center gap-2 ${pulse}`}
    >
      <SkeletonBlock className="h-12 flex-1 rounded-[10px] bg-[#1758BA]/20" />
      <SkeletonBlock className="h-12 w-12 shrink-0 rounded-[10px] bg-gray-100" />
      <SkeletonBlock className="h-12 w-12 shrink-0 rounded-[10px] bg-gray-100" />
    </div>
  );
}

function MobileFABSkeleton() {
  return (
    <div
      className={`lg:hidden fixed bottom-[88px] right-5 z-[39] w-14 h-14 rounded-full bg-gray-200 shadow-md ${pulse}`}
      aria-hidden
    />
  );
}

export default function BuilderLoading() {
  return (
    <div className="w-full h-full flex flex-col px-2 lg:px-4 pt-2 min-h-[calc(100dvh-5rem)]">
      <HeaderSkeleton />

      <div className="lg:hidden shrink-0 px-10 pb-2">
        <TabsSkeleton compact />
      </div>

      <div className="flex flex-1 min-h-0 gap-3 lg:flex-row flex-col">
        <div
          className="flex-1 min-h-0 overflow-hidden lg:pr-2 pb-24 lg:pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          <KanbanBoardSkeleton />
        </div>

        <div className="hidden lg:flex flex-col shrink- pt-[9px]">
          <div className="px-10 pb-2">
            <TabsSkeleton />
          </div>
          <SidebarSkeleton />
        </div>
      </div>

      <MobileBottomBarSkeleton />
      <MobileFABSkeleton />
    </div>
  );
}

/** @deprecated Use BuilderLoading — kept for existing imports */
export function DesignerSidebarSkeleton() {
  return (
    <Fragment>
      <SidebarSkeleton />
    </Fragment>
  );
}
