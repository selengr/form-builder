import {ImSpinner2} from "react-icons/im";
import {IoStatsChartOutline} from "react-icons/io5";
import {LuUserRoundPlus} from "react-icons/lu";
import {Tooltip} from "@mui/material";
import { Key } from "react";

interface StatsTableProps {
  headData: any[];
  allData: any[];
  isLoading: boolean;
}

export function ReportTable({headData, allData, isLoading}: StatsTableProps) {
  return (
    <div className="w-full md:max-h-[calc(100vh-155px)] max-h-[calc(100vh-220px)] overflow-auto rounded-xl border">
      {isLoading ? (
        <div className="w-full h-[300px] flex justify-center items-center">
          <ImSpinner2 className="animate-spin h-12 w-12"/>
        </div>
      ) : (
        <table className="min-w-[700px] w-full border-separate border-spacing-0">
          <thead>
          <tr>
            {headData.map((item) => (
              <th
                key={item.questionId}
                className="bg-[#F7F7FF] font-bold text-black text-center px-4 py-3 text-sm w-[200px] truncate"
              >
                <div
                  className="truncate"
                  title={item.questionTitle}
                  dir="rtl"
                >
                  {item.questionTitle}
                </div>
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {allData.map((row, rowIndex) => (
            <tr
              key={row.row[0]?.questionId || rowIndex}
              className={
                rowIndex % 2 !== 0 ? "bg-[#F7F7FF]" : "bg-white"
              }
            >
              {row.row.map((data: { answer: any[]; }, i: Key | null | undefined) => (
                <td
                  key={i}
                  className="text-center px-3 py-2 font-semibold text-sm w-[200px]"
                >
                  <Tooltip
                    title={data.answer.join(" - ")}
                    followCursor
                    arrow
                    placement="top"
                  >
                    <div className="overflow-hidden text-ellipsis line-clamp-3"
                         style={{display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3}}>
                      {data.answer
                        .map((d) => d)
                        .join(" - ")
                        .slice(0, 400)}
                      {data.answer.join(" - ").length > 400 ? "..." : ""}
                    </div>
                  </Tooltip>
                </td>
              ))}

              <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className={`rounded-md p-2 ${
                      row.id === 3 ? "bg-red-500" : "bg-teal-400"
                    }`}
                  >
                    <LuUserRoundPlus className="text-white"/>
                  </button>
                  <button className="rounded-md p-2 bg-blue-700">
                    <IoStatsChartOutline className="text-white"/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReportTable;
