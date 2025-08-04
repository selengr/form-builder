"use client"
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useParams, useSearchParams } from "next/navigation";

interface ResultRow {
  row: string;
}
interface Result {
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const { id } = useParams()
  const [results, setResults] = useState<Result[]>([]);

  const searchParams = useSearchParams()
  const search = searchParams.get('name')

  useEffect(() => {
    const storedResults = localStorage.getItem('testResult');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);


  return (
    <div className="w-full min-h-screen h-full px-4 py-4 bg-[#f7f7f7]">
      <div className="md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full ">
        <div className="relative flex w-full justify-center items-center min-h-[52px] h-[52px] rounded-lg bg-[#F7F7FF]">
          <Link href={`/stats/${id}`} className="absolute right-4">
            <IconButton
              sx={{
                borderRadius: "9999px",
              }}
            >
              <IoIosArrowForward fontSize="1.1rem" color="#000" />
            </IconButton>
          </Link>
          <span className="text-[#161616]">گزارش فرم {search ?? "---"}</span>
        </div>

        <div className="overflow-y-auto w-full flex justif flex-col items-center">
          <Image
            src="/images/calc/ic_empty_report.svg"
            alt="سایا لوگو"
            width={416}
            height={250}
            priority
            draggable={false}
            className="w-full sm:w-[50%] lg:w-[450px]"
          />

          <div className="p-8 pt-0 max-w-[600px]">
            {results?.map((result, index) => (
              <div key={index} className="mb-4 last:mb-0">
                {/* <h2 className="text-right text-[15px] font-bold text-[#161616] mb-1"></h2> */}
                {result.resultRows.map((row, rowIndex) => (
                  <p
                    key={rowIndex}
                    className="text-justify font-medium text-[#161616] mb-2"
                  >
                    {row.row}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;