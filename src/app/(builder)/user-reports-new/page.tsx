'use client';

import { useRouter } from 'next/navigation';
import { ReportHeader, ReportPagination, ReportTable } from '@/templates/user-reports-new';
import { useStatsViewModel } from '@/templates/user-reports-new/viewModel';

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
