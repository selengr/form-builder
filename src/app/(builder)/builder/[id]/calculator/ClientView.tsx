"use client";

import dynamic from "next/dynamic";
// templates
import DesignerTabs from "@/templates/builder/TabComponent";
import CalculatorSkeleton from "@/templates/calculator/CalculatorSkeleton";

const CalculatorList = dynamic(
  () => import("@/templates/calculator/CalculatorList")
);

interface ClientViewProps<T> {
  calculators: T[];
  isPending: boolean;
  error: Error | null;
}
export default function ClientView<T>({ calculators, isPending, error }: ClientViewProps<T>) {

  return (
    <div className="w-full min-h-full px-4 py-4 ">
      <div className="relative container mx-auto flex flex-col justify-start items-center h-full bg-white rounded-xl w-full">
        <DesignerTabs />
        {!error && isPending && <CalculatorSkeleton />}
        {!error && !isPending && <CalculatorList calculators={calculators} />}
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
