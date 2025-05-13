import {ImSpinner2} from "react-icons/im";
import {IoStatsChartOutline} from "react-icons/io5";
import {LuUserRoundPlus} from "react-icons/lu";
import {Tooltip} from "@mui/material";
import {Key} from "react";

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
            <table className="min-w-[700px] w-full border-collapse">
              <thead className="sticky top-0 z-10">
              <tr>

                {/* ستون‌های داده */}
                {headData.map((item, index) => (
                    <Tooltip
                        key={item.questionId}
                        title={item.questionTitle}
                        followCursor
                        arrow
                        enterDelay={1000}
                        placement="top"
                    >
                      <th
                          className={`
                    bg-[#F7F7FF] font-bold text-black text-center px-4 py-3 text-sm w-[200px] truncate
                    ${index === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'}
                    ${index === headData.length - 1 ? 'border-r-0' : ''}
                    border-slate-300
                  `}
                      >
                        <div className="truncate" title={item.questionTitle} dir="rtl">
                          {item.questionTitle}
                        </div>
                      </th>
                    </Tooltip>
                ))}
              </tr>
              </thead>

              <tbody>
              {allData.map((row, rowIndex) => (
                  <tr
                      key={row.row[0]?.questionId || rowIndex}
                      className={rowIndex % 2 !== 0 ? "bg-[#F7F7FF]" : "bg-white"}
                  >

                    {/* پاسخ‌ها */}
                    {row.row.map((data: { answer: any[]; }, i: number) => (
                        <td
                            key={i}
                            className={`
                    text-center px-3 py-2 font-semibold text-sm w-[200px]
                    ${i === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'}
                    ${i === row.row.length - 1 ? 'border-r-0' : ''}
                    border-slate-300
                  `}
                        >
                          <Tooltip
                              title={Array.isArray(data.answer) ? data.answer.join(" - ") : data.answer}
                              followCursor
                              arrow
                              enterDelay={600}
                              leaveDelay={100}
                              placement="top"
                          >
                            <div
                                className="overflow-hidden text-ellipsis line-clamp-3"
                                style={{display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3}}
                            >
                              {Array.isArray(data.answer)
                                  ? data.answer.map((d) => d).join(" - ").slice(0, 400)
                                  : String(data.answer).slice(0, 400)}
                              {(Array.isArray(data.answer)
                                  ? data.answer.join(" - ").length > 400
                                  : String(data.answer).length > 400) && "..."}
                            </div>
                          </Tooltip>
                        </td>
                    ))}

                    {/* ستون عملیات */}
                    <td className="px-4 py-2 border-l-0 border-slate-300">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-md p-2 bg-teal-400">
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