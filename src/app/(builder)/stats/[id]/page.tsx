"use client";

import { useRouter } from "next/navigation";
import { ReportHeader, ReportPagination, ReportTable } from "./component";
import { useStatsViewModel } from "./viewModel";

export default function StatsPage() {
  const router = useRouter();
  const { formData, headData, allData, isLoading } = useStatsViewModel();

  return (
    <div className="w-full p-4 bg-white">
      <ReportHeader
        title={formData.name || 'گزارش'}
        onBack={() => router.push("/")}
      />

      <ReportTable
        headData={headData}
        allData={allData}
        isLoading={isLoading}
      />

      <ReportPagination totalItems={allData.length} />
    </div>
  );
}
