"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {IconButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import {IoIosArrowForward} from "react-icons/io";

interface ResultRow {
    row: string;
}

interface Result {
    resultRows: ResultRow[];
}

const ResultsPage = () => {
    const {id} = useParams();
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const storedResults = localStorage.getItem("testResult");
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    return (<div className="w-full min-h-screen px-4 py-4 ">
            <div className="mx-auto flex p-3 flex-col justify-start items-center bg-white rounded-xl  h-full w-full">
                <div className="relative flex w-full justify-center items-center h-[52px] rounded-lg bg-[#F7F7FF]">
                    <Link href={`/stats/${id}`} className="absolute right-4">
                        <IconButton sx={{borderRadius: "9999px"}}>
                            <IoIosArrowForward fontSize="1.1rem" color="#000"/>
                        </IconButton>
                    </Link>
                    <span className="text-[#161616] font-medium text-sm">گزارش</span>
                </div>

                <div className="p-8 mt-10 max-w-[640px] w-full space-y-6">

                    {results?.map((result, index) => (<div key={index} className="space-y-4">
                            {result.resultRows.map((row, rowIndex) => (<div
                                    key={rowIndex}
                                    className="flex gap-3 items-start text-[#161616]"
                                >
                                    <div className="w-[4px] h-full mt-1 rounded-full bg-gray-300"/>
                                    <p className="text-justify leading-relaxed font-normal text-sm md:text-base border-r-4 p-3 border-blue-600">
                                        {row.row}
                                    </p>
                                </div>))}
                        </div>))}
                </div>
            </div>
        </div>);
};

export default ResultsPage;