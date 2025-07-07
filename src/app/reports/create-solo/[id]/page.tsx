"use client";
import dynamic from "next/dynamic";
// _hooks
import { useGetList } from "./_hooks/useGetList";
// templates
import Header from "@/templates/reports/HeaderReports";
import ErrorDisplay from "@/templates/condition/ErrorDisplay";
import ConditionSkeleton from "@/templates/reports/condition/ConditionSkeleton";
const ConditionList = dynamic(() => import("@/templates/reports/condition/ConditionList"));

export default function Reports() {
  const { data, isPending, error } = useGetList();

  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
        <Header />

        {!error && isPending && <ConditionSkeleton />}
        {!error && !isPending && <ConditionList conditions={data} />}
        {error && <ErrorDisplay title="گزارش ها" message={error?.message} />}
      </div>
    </div>
  );
}
