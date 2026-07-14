'use client';

import clsx from 'clsx';

const pulse = 'animate-pulse';

function Block({ className = '' }: { className?: string }) {
  return <div className={clsx('bg-gray-200 rounded-lg', pulse, className)} />;
}

function CalculatorCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="relative w-full min-h-[56px] rounded-xl border border-[#DDE1E6] bg-white px-2 py-2 flex items-center gap-3 pl-12"
    >
      <Block className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-[10px] bg-gray-100" />
      <Block className="h-9 w-9 shrink-0 rounded-[10px] bg-[#F7F7FF]" />
      <Block className="h-4 flex-1 max-w-[200px] rounded-md" />
    </div>
  );
}

function ConditionCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="relative w-full rounded-xl border border-[#DDE1E6] bg-white p-3 pl-12"
    >
      <Block className="absolute left-3 top-3 h-9 w-9 rounded-[10px] bg-gray-100" />
      <div className="flex items-start gap-2 mb-3">
        <Block className="h-9 w-9 shrink-0 rounded-[10px] bg-[#F7F7FF]" />
      </div>
      <div className="flex flex-wrap gap-2 pr-1">
        <Block className="h-7 w-16 rounded-full bg-[#E8EEF8]/80" />
        <Block className="h-7 w-20 rounded-full bg-[#EAFBF9]/80" />
        <Block className="h-7 w-14 rounded-full bg-[#F3E8FF]/80" />
        <Block className="h-7 w-24 rounded-full bg-gray-100" />
        <Block className="h-7 w-12 rounded-full bg-[#E8EEF8]/80" />
        <Block className="h-7 w-[72px] rounded-full bg-[#FFEBEE]/60" />
      </div>
    </div>
  );
}

interface LogicBoardSkeletonProps {
  count?: number;
  className?: string;
}

export default function LogicBoardSkeleton({
  count = 3,
  className,
}: LogicBoardSkeletonProps) {
  return (
    <div
      dir="rtl"
      className={clsx(
        'flex flex-col w-full h-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden min-h-[300px]',
        className,
      )}
    >
      <div className="flex flex-col w-full px-3 pt-3 gap-2 pb-3">
        {Array.from({ length: count }).map((_, index) =>
          index % 2 === 0 ? (
            <CalculatorCardSkeleton key={index} />
          ) : (
            <ConditionCardSkeleton key={index} />
          ),
        )}
      </div>
    </div>
  );
}