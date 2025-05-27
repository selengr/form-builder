"use client";

import dynamic from "next/dynamic";
// _hooks
import { useGetList } from "./_hooks/useGetList";
import DesignerTabs from "@/templates/builder/TabComponent";
import CalculatorSkeleton from "@/templates/calculator/CalculatorSkeleton";

const CalculatorList = dynamic(
  () => import("@/templates/calculator/CalculatorList")
);

export default function ClientView() {
  const { data, isPending, error } = useGetList();

  return (
    <div className="w-full min-h-full px-4 py-4 ">
      <div className="relative container mx-auto flex flex-col justify-start items-center h-full bg-white rounded-xl w-full">
        <DesignerTabs />
        {!error && isPending && <CalculatorSkeleton />}
        {!error && !isPending && <CalculatorList calculators={data} />}
        {error && (
          <div className="flex flex-col absolute top-[250px] justify-center items-center">
            <span className="text-red-500">
              !!خطا در بارگذاری لیست محاسبه گر
            </span>
            <span>{error?.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
