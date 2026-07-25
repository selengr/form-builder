'use client';

import clsx from 'clsx';

function Block({ className = '' }: { className?: string }) {
  return <div className={clsx('bg-gray-200 rounded-lg animate-pulse', className)} />;
}

function KeypadSkeleton({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <div dir="ltr" className="flex flex-row gap-3 w-full max-w-[360px] mx-auto animate-pulse">
        <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#F7F7FF] w-[90px] shrink-0">
          <Block className="h-9 rounded-xl bg-gray-100" />
          <Block className="h-9 rounded-xl bg-white" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-[6px]">
          <Block className="h-9 w-full rounded-xl bg-[#E8EEF8]/80" />
          <div className="flex gap-[6px]">
            <Block className="h-9 flex-1 rounded-xl" />
            <Block className="h-9 flex-1 rounded-xl" />
            <Block className="h-9 flex-1 rounded-xl bg-[#FFEBEE]/80" />
          </div>
          <div className="grid grid-cols-3 gap-[6px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <Block key={i} className="h-9 rounded-xl bg-gray-100" />
            ))}
          </div>
          <div className="flex gap-[6px]">
            <Block className="h-9 flex-[2] rounded-xl bg-gray-100" />
            <Block className="h-9 flex-1 rounded-xl bg-gray-100" />
            <div className="flex flex-col gap-[6px] w-9 shrink-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <Block key={i} className="h-9 w-full rounded-xl bg-[#EAFBF9]/80" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className="flex flex-col shrink-0 mr-[48px] ml-[28px] w-[164px] animate-pulse"
    >
      <div className="flex flex-row-reverse items-center justify-center gap-6 mb-3 border-b border-[#E8E8E8] pb-2">
        <Block className="h-4 w-10 rounded" />
        <Block className="h-4 w-10 rounded bg-[#1758BA]/20" />
      </div>

      <Block className="h-9 w-full rounded-xl mb-[6px] bg-[#E8EEF8]/80" />

      <div className="flex gap-[6px] mb-[6px]">
        <Block className="h-9 flex-1 rounded-xl bg-[#EAFBF9]/80" />
        <Block className="h-9 flex-1 rounded-xl bg-[#EAFBF9]/80" />
        <Block className="h-9 flex-1 rounded-xl bg-[#FFEBEE]/80" />
      </div>

      <div className="flex gap-[6px]">
        <div className="flex-1 flex flex-col gap-[6px]">
          {Array.from({ length: 3 }).map((_, row) => (
            <div key={row} className="flex gap-[6px]">
              {Array.from({ length: 3 }).map((_, col) => (
                <Block key={col} className="h-9 flex-1 rounded-xl bg-gray-100" />
              ))}
            </div>
          ))}
          <div className="flex gap-[6px]">
            <Block className="h-9 flex-[2] rounded-xl bg-gray-100" />
            <Block className="h-9 flex-1 rounded-xl bg-gray-100" />
          </div>
        </div>
        <div className="flex flex-col gap-[6px] w-9 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="h-9 w-full rounded-xl bg-[#EAFBF9]/80" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScriptAreaSkeleton() {
  return (
    <div className="relative w-full rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] p-3 h-[250px] max-h-[250px] overflow-hidden">
      <div className="flex flex-wrap gap-2 items-start content-start animate-pulse">
        <Block className="h-8 w-28 rounded-xl bg-[#E8EEF8]/90" />
        <Block className="h-8 w-8 rounded-xl bg-[#EAFBF9]/90" />
        <Block className="h-8 w-24 rounded-xl bg-gray-100" />
        <Block className="h-8 w-8 rounded-xl bg-[#EAFBF9]/90" />
        <Block className="h-8 w-32 rounded-xl bg-[#F3E8FF]/90" />
        <Block className="h-8 w-14 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

function FooterButtonsSkeleton() {
  return (
    <div className="flex gap-4 w-full justify-center mt-3 mb-1 animate-pulse">
      <Block className="h-12 w-[132px] rounded-xl bg-[#1758BA]/25" />
      <Block className="h-12 w-[132px] rounded-xl border border-[#1758BA]/30 bg-white" />
    </div>
  );
}

export interface AdvancedFormulaEditorSkeletonProps {
  className?: string;
}

export default function AdvancedFormulaEditorSkeleton({
  className,
}: AdvancedFormulaEditorSkeletonProps) {
  return (
    <div dir="rtl" className={clsx('w-full flex flex-col', className)}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full">
          <Block className="h-4 w-8 rounded mb-1.5" />
          <Block className="h-[52px] w-full rounded-xl" />
        </div>

        <div className="w-full flex flex-col md:flex-row-reverse lg:flex-row gap-4 items-start">
          <div className="flex-1 w-full min-w-0 flex flex-col order-2 lg:order-1">
            <Block className="h-4 w-14 rounded mb-1.5" />
            <ScriptAreaSkeleton />
          </div>

          <div className="hidden md:block order-1 lg:order-2 shrink-0">
            <KeypadSkeleton />
          </div>
        </div>

        <div className="md:hidden px-1 flex justify-center items-center pb-1">
          <KeypadSkeleton mobile />
        </div>
      </div>

      <FooterButtonsSkeleton />
    </div>
  );
}

export function CalculatorEditorDialogSkeleton({
  className,
}: AdvancedFormulaEditorSkeletonProps) {
  return (
    <AdvancedFormulaEditorSkeleton className={clsx('min-h-[480px]', className)} />
  );
}
