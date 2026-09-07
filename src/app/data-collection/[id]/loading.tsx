import ReportTableSkeleton from '@/app/stats/[id]/component/ReportTableSkeleton';

export default function DataCollectionStatsLoading() {
  return (
    <div className="w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden">
      <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0 gap-4">
        <div className="h-[52px] rounded-lg bg-[#F7F7FF] animate-pulse" />
        <ReportTableSkeleton />
        <div className="h-12 rounded-lg bg-[#F7F7FF] animate-pulse" />
      </div>
    </div>
  );
}
