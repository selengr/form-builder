"use client";

import {useRouter} from "next/navigation";
import {ReportHeader, ReportPagination, ReportTable} from "./component";
import {useStatsViewModel} from "./viewModel";

export default function StatsPage() {
  const router = useRouter();
  const {
    formData,
    headData,
    allData,
    isLoading,
    page: currentPage,
    setPage: setCurrentPage,
    pageSize: rowsPerPage,
    setPageSize: setRowsPerPage,
    totalItems
  } = useStatsViewModel();

  return (
    <div className="w-full grow flex flex-col md:p-4 p-2">
      <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col">
        <ReportHeader
          title={formData.name || "گزارش"}
          onBack={() => router.push("/")}
        />

        <div className="flex-grow overflow-x-auto overflow-y-hidden">
          <ReportTable
            headData={headData}
            allData={allData}
            isLoading={isLoading}
          />
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
