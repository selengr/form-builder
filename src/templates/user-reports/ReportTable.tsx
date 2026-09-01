import { Tooltip } from '@mui/material';
import { TableCell } from './TableCell';
import { VscEye } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';
import ReportTableSkeleton from './ReportTableSkeleton';

interface IContent {
  formId: number;
  formName: string;
  userFullName: string;
  numberOfReportingPoints: number;
  publicationApprovalByAdmin: any;
  reporterInformation: any;
}

interface StatsTableProps {
  headData: any[];
  allData: IContent[];
  isLoading: boolean;
}

export function ReportTable({ headData, allData, isLoading }: StatsTableProps) {
  const { push } = useRouter();

  const handleShow = (id: number, formName: string, publicationApprovalByAdmin: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('publicationApprovalByAdmin', JSON.stringify(publicationApprovalByAdmin));
    }
    push(`/user-reports/${id}?formName=${formName}`);
  };

  if (isLoading) {
    return <ReportTableSkeleton />;
  }

  return (
    <div className="w-full md:max-h-[calc(100vh-155px)] max-h-[calc(100vh-220px)] overflow-auto rounded-xl border">
      <table className="min-w-[700px] w-full border-collapse">
        <thead className="sticky top-0 z-10 mb-2">
          <tr>
            {headData.map((item, index) => (
              <Tooltip
                key={item.questionId ?? index}
                title={item.questionTitle}
                followCursor
                arrow
                enterDelay={1000}
                placement="top">
                <th
                  className={`
                    bg-[#F7F7FF] font-bold text-black text-center px-4 py-3 text-sm w-[200px] truncate
                    ${index === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'}
                    ${index === headData.length - 1 ? 'border-r-0' : ''}
                    border-slate-300
                  `}>
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
            <tr key={rowIndex} className={rowIndex % 2 !== 0 ? 'bg-[#F7F7FF]' : 'bg-white'}>
              <TableCell content={rowIndex + 1} rowIndex={rowIndex} />
              <TableCell content={row.formName} rowIndex={rowIndex} />
              <TableCell content={row.userFullName} rowIndex={rowIndex} />
              <TableCell content={row.numberOfReportingPoints} rowIndex={rowIndex} />
              <TableCell
                content={
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.publicationApprovalByAdmin
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                    {row.publicationApprovalByAdmin ? 'فعال' : 'غیرفعال'}
                  </span>
                }
                rowIndex={rowIndex}
              />
              <td className="px-4 py-2 border-l-0 border-slate-300 align-middle">
                <div className="flex items-center justify-center gap-2 align-middle">
                  <button
                    onClick={() =>
                      handleShow(row.formId, row.formName, row.publicationApprovalByAdmin)
                    }
                    className="rounded-[8px] border-none p-2 bg-[#1758BA]">
                    <VscEye className="text-white w-6 h-6" width={24} height={24} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
