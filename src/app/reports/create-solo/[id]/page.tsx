"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { IoIosArrowForward } from "react-icons/io";
// mui
import { IconButton } from "@mui/material";
// _hooks
import { useGetList } from "./_hooks/useGetList";
// templates
import ConditionSkeleton from "@/templates/reports/condition/ConditionSkeleton";
const ConditionList = dynamic(() => import("@/templates/reports/condition/ConditionList"));

export default function Calculator() {
  const { data, isPending, error } = useGetList()

  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
        <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
          <Link href={`/reports`} className="absolute right-4">
            <IconButton
              sx={{
                borderRadius: "9999px",
              }}
            >
              <IoIosArrowForward fontSize="1.1rem" color="#000" />
            </IconButton>
          </Link>
          ساخت گزارش
        </div>

        
        {!error && isPending && <ConditionSkeleton />}
        {!error && !isPending &&  <ConditionList conditions={data}/>}
          {error && (
          <div className="flex flex-col absolute top-[250px] justify-center items-center">
            <span className="text-red-500">
              !!خطا در بارگذاری لیست شرط ها
            </span>
            <span>{error?.message}</span>
          </div>
        )}
      </div>
    </div>
  );    
}







