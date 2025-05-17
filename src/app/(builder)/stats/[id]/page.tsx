"use client";

import {useRouter} from "next/navigation";
import {ReportHeader, ReportPagination, ReportTable} from "./component";
import {useStatsViewModel} from "./viewModel";
import {useState} from "react";

export default function StatsPage() {
  const router = useRouter();
  const {formData, headData, allData, isLoading} = useStatsViewModel();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25); // -1 means "all"

  const startIndex = rowsPerPage === -1 ? 0 : (currentPage - 1) * rowsPerPage;
  const endIndex = rowsPerPage === -1 ? allData.length : currentPage * rowsPerPage;
  const paginatedData = allData.slice(startIndex, endIndex);

  return (
    <div className="w-full p-4 bg-white">
      <ReportHeader
        title={formData.name || "گزارش"}
        onBack={() => router.push("/")}
      />

      <ReportTable
        headData={headData}
        allData={paginatedData}
        isLoading={isLoading}
      />

      <ReportPagination
        totalItems={allData.length}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  );
}
