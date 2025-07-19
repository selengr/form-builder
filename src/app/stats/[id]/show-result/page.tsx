"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { IconButton } from "@mui/material";
import { usePostCondition } from "./hooks/usePostCondition";

const ResultsPage = () => {
    // const { mutate, isPending, isError, data } = usePostCondition();

    // const [formId, setFormId] = useState(1);
    // const [takePartId, setTakePartId] = useState(2);

    //   mutate({
    //     data: [
    //       {
    //         formId: formId,
    //         takePartId: takePartId
    //       }
    //     ]
    //   });

    //       useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await mutate({
    //             data: [
    //                 {
    //                     formId: formId,
    //                     takePartId: takePartId
    //                 }
    //             ]
    //         });
    //         console.log('response', response)
    //     };
    //     if (formId && takePartId) {
    //         fetchData();
    //     }
    // }, []);
   

  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
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
          <span className="text-[#161616]">گزارش فرم فلان</span>
        </div>

        <Image
          src="/images/calc/ic_empty_report.svg"
          alt="سایا لوگو"
          width={416}
          height={250}
          priority
          draggable={false}
          className="w-full sm:w-[50%] lg:w-[500px]"
        />

        <div className="p-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="mb-8 last:mb-0">
              <h2 className="text-right text-[15px] font-bold text-[#161616] mb-1">
                سلام محمد جواد سلیمانی فرد عزیز
              </h2>
              <p className="text-right font-medium text-[#161616] mb-2">
                با توجه به نتایج آزمون شما، وضعیت افسردگی شما در جایگاه متوسط
                قرار دارد.
              </p>
              <p className="text-right font-medium text-[#161616]">
                میزان افسردگی شما برابر ۸۰ می‌باشد.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;