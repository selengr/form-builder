"use client"
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface ResultRow {
  row: string;
}
interface Result {
  resultRows: ResultRow[];
}

const ResultsPage = () => {
  const { id } = useParams()
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const storedResults = localStorage.getItem('testResult');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);


  return (
    <div className="w-full min-h-screen px-4 py-4 bg-[#f7f7f7]">
      <div className="md:container mx-auto flex p-3 flex-col justify-start items-center min-w-screen h-full bg-white rounded-xl w-full">
        <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
          <Link href={`/stats/${id}`} className="absolute right-4">
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

        <div className="p-8 max-w-[600px]">
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
  );
};

export default ResultsPage;