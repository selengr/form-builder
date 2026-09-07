'use client';

import { Skeleton } from '@mui/material';

const COLUMN_COUNT = 7;
const ROW_COUNT = 10;

export default function ReportTableSkeleton() {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden min-w-0">
      <div className="w-full h-full overflow-x-auto min-w-0">
        <table className="table-auto min-w-full border-collapse border border-gray-200">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {Array.from({ length: COLUMN_COUNT }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-center border-r border-neutral-200"
                  style={{ minWidth: index === COLUMN_COUNT - 1 ? '120px' : '100px' }}>
                  <Skeleton variant="text" width="70%" height={20} animation="wave" sx={{ mx: 'auto' }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 !== 0 ? 'bg-neutral-50' : 'bg-white'}>
                {Array.from({ length: COLUMN_COUNT - 1 }).map((_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-center border-b border-r border-gray-200"
                    style={{ minWidth: '100px' }}>
                    <Skeleton
                      variant="text"
                      width={cellIndex === 0 ? '30%' : '60%'}
                      height={20}
                      animation="wave"
                      sx={{ mx: 'auto' }}
                    />
                  </td>
                ))}
                <td
                  className="sticky left-0 px-4 py-3 text-center border-b border-r border-gray-200 bg-inherit"
                  style={{ minWidth: '120px' }}>
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton variant="rounded" width={36} height={36} animation="wave" sx={{ borderRadius: '12px' }} />
                    <Skeleton variant="rounded" width={36} height={36} animation="wave" sx={{ borderRadius: '12px' }} />
                    <Skeleton variant="rounded" width={36} height={36} animation="wave" sx={{ borderRadius: '12px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
