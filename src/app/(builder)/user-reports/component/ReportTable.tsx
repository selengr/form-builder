import {ImSpinner2} from "react-icons/im";
import {IoStatsChartOutline} from "react-icons/io5";
import {LuUserRoundPlus} from "react-icons/lu";
import {Tooltip} from "@mui/material";
import { TableCell } from "./TableCell";

interface IContent {
    formName: string;
    userFullName: string;
    numberOfReportingPoints: number;
    publicationApprovalByAdmin: any; 
    reporterInformation: any; 
};

interface StatsTableProps {
  headData: any[];
  allData: IContent[];
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
          <thead className="sticky top-0 z-10 mb-2">
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
              key={rowIndex}
              className={rowIndex % 2 !== 0 ? "bg-[#F7F7FF]" : "bg-white"}
            >

                                <TableCell content={rowIndex} isFirst={rowIndex === 0} isLast={false} rowIndex={rowIndex} />
                                <TableCell content={row.formName} isFirst={rowIndex === 0} isLast={false} rowIndex={rowIndex} />
                                <TableCell content={row.reporterInformation} isFirst={rowIndex === 0} isLast={false} rowIndex={rowIndex} />
                                <TableCell content={row.numberOfReportingPoints} isFirst={rowIndex === 0} isLast={false} rowIndex={rowIndex} />
                                <TableCell content={row.publicationApprovalByAdmin} isFirst={rowIndex === 0} isLast={false} rowIndex={rowIndex} />

              {/* ستون عملیات */}
              <td className="px-4 py-2 border-l-0 border-slate-300 align-middle">
                <div className="flex items-center justify-center gap-2 align-middle">
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
