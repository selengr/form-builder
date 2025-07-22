"use client";

import dynamic from "next/dynamic";
// templates
import {ConditionSkeleton} from "@/templates/condition";
import DesignerTabs from "@/templates/builder/TabComponent";
import ErrorDisplay from "@/templates/condition/ErrorDisplay";

const ConditionList = dynamic(() => import("@/templates/condition/ConditionList"));

interface IProps<T> {
  conditions: any | T[];
  isPending: boolean;
  error: Error | null;
}
export default function ClientView<T>({
  conditions,
  isPending,
  error,
}: IProps<T>) {
  return (
    <div className="w-full min-h-screen px-4 py-4">
      <div className=" mx-auto flex flex-col min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-40px)] justify-start items-center bg-white rounded-xl w-full">
        <DesignerTabs />

        {!error && isPending && <ConditionSkeleton />}
        {!error && !isPending && <ConditionList conditions={conditions} />}
        {error && <ErrorDisplay title="شرط ها" message={error?.message} />}
      </div>
    </div>
  );
}
