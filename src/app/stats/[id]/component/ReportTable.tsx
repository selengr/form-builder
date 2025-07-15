import {ImSpinner2} from "react-icons/im";
import {IoStatsChartOutline} from "react-icons/io5";
import {LuUserRoundPlus} from "react-icons/lu";
import {Tooltip} from "@mui/material";

interface StatsTableProps {
  headData: any[];
  allData: any[];
  isLoading: boolean;
}

export function ReportTable({headData, allData, isLoading}: StatsTableProps) {
  const actionColumnWidth = "120px";
  const dataColumnMinWidth = "100px";

  return (<div className="w-[100%] h-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden min-w-0">
      {isLoading ? (<div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500">
          <ImSpinner2 className="animate-spin h-12 w-12 text-blue-600 mb-4"/>
          <p className="text-lg font-semibold">در حال بارگذاری اطلاعات...</p>
        </div>) : allData.length === 0 ? (
        <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500">
          <IoStatsChartOutline className="h-16 w-16 text-gray-400 mb-4"/>
          <p className="text-lg font-semibold">داده‌ای برای نمایش یافت نشد.</p>
          <p className="text-sm text-gray-400">لطفاً فیلترهای خود را بررسی کنید.</p>
        </div>) : (<div className="w-full h-full overflow-x-auto min-w-0">
          <table className="table-auto min-w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {headData.map((item) => (<Tooltip
                  key={item.questionId}
                  title={item.questionTitle}
                  followCursor
                  arrow
                  enterDelay={1000}
                  placement="top"
                >
                  <th
                    className="px-4 py-3 text-sm font-semibold text-gray-700 text-center truncate border-r border-gray-200"
                    style={{minWidth: dataColumnMinWidth}}
                  >
                    <div className="truncate" title={item.questionTitle} dir="rtl">
                      {item.questionTitle}
                    </div>
                  </th>
                </Tooltip>))}
            </tr>
            </thead>
            <tbody>
            {allData.map((row, rowIndex) => (<tr
                key={row.row[0]?.questionId || rowIndex}
                className={`${rowIndex % 2 !== 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-150`}
              >
                {row.row.map((data: { answer: any[] }, i: number) => (<td
                    key={i}
                    className="px-4 py-2 text-sm text-gray-800 text-center border-b border-r border-gray-200 align-top"
                    style={{minWidth: dataColumnMinWidth}}
                  >
                    <Tooltip
                      title={Array.isArray(data.answer) ? data.answer.join(" - ") : String(data.answer)}
                      followCursor
                      arrow
                      enterDelay={600}
                      leaveDelay={100}
                      placement="top"
                    >
                      <div
                        className="overflow-hidden text-ellipsis"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {Array.isArray(data.answer) ? data.answer.join(" - ") : String(data.answer)}
                      </div>
                    </Tooltip>
                  </td>))}
                <td
                  className="px-4 py-2 text-center border-b border-r border-gray-200 align-middle"
                  style={{minWidth: actionColumnWidth}}
                >
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="rounded-xl p-2 bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200 shadow-sm">
                      <LuUserRoundPlus className="w-5 h-5"/>
                    </button>
                    <button
                      className="rounded-xl p-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm">
                      <IoStatsChartOutline className="w-5 h-5"/>
                    </button>
                  </div>
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>)}
    </div>);
}

export default ReportTable;