"use client";

import dynamic from "next/dynamic";
// templates
import { CalculatorSkeleton } from "@/templates/calculator";
import DesignerTabs from "@/templates/builder/TabComponent";

const CalculatorList = dynamic(
  () => import("@/templates/calculator/CalculatorList")
);

interface IProps<T> {
  calculators: T[];
  isPending: boolean;
  error: Error | null;
}
export default function ClientView<T>({ calculators, isPending, error }: IProps<T>) {

  return (
    <div className="w-full min-h-full px-4 py-4 ">
      <div className=" mx-auto flex flex-col min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-40px)] justify-start items-center bg-white rounded-xl w-full">
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
