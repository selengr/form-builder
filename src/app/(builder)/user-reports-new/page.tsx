'use client';

import { useRouter } from 'next/navigation';
import { ReportHeader, ReportPagination, ReportTable } from '@/templates/user-reports-new';
import { useStatsViewModel } from '@/templates/user-reports-new/viewModel';
import ReportTableSkeleton from '@/templates/user-reports-new/ReportTableSkeleton';

function MainPageSkeleton() {
  return (
    <div className="w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden">
      <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0">
        <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative">
          <p className="text-[16px] text-center font-bold text-[#161616]">گزارشات کاربری</p>
        </div>
        <div className="flex-grow overflow-hidden min-w-0">
          <ReportTableSkeleton />
        </div>
      </div>
    </div>
  );
}

export default function UserReportsNewPage() {
  const router = useRouter();
  const {
    headData,
    allData,
    isLoading,
    page: currentPage,
    setPage: setCurrentPage,
    pageSize: rowsPerPage,
    setPageSize: setRowsPerPage,
    totalItems,
  } = useStatsViewModel();

  if (isLoading && allData.length === 0 && headData.length === 0) {
    return <MainPageSkeleton />;
  }

  return (
    <div className="w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden">
      <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0">
        <ReportHeader title={'گزارشات کاربری'} onBack={() => router.push('/')} />

        <div className="flex-grow overflow-hidden min-w-0">
          <ReportTable headData={headData} allData={allData} isLoading={isLoading} />
        </div>

        <ReportPagination
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </div>
  );
}
