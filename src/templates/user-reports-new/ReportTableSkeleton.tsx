'use client';

import { Skeleton } from '@mui/material';

const COLUMN_COUNT = 6;
const ROW_COUNT = 8;

export default function ReportTableSkeleton() {
  return (
    <div className="w-full md:max-h-[calc(100vh-155px)] max-h-[calc(100vh-220px)] overflow-auto rounded-xl border">
      <table className="min-w-[700px] w-full border-collapse">
        <thead className="sticky top-0 z-10 mb-2">
          <tr>
            {Array.from({ length: COLUMN_COUNT }).map((_, index) => (
              <th
                key={index}
                className={`bg-[#F7F7FF] px-4 py-3 w-[200px] ${
                  index === 0 ? 'border-l-0 border-r-0' : 'border-x-[0.5px]'
                } ${index === COLUMN_COUNT - 1 ? 'border-r-0' : ''} border-slate-300`}>
                <Skeleton variant="text" width="70%" height={20} animation="wave" sx={{ mx: 'auto' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 !== 0 ? 'bg-[#F7F7FF]' : 'bg-white'}>
              {Array.from({ length: COLUMN_COUNT - 1 }).map((_, cellIndex) => (
                <td
                  key={cellIndex}
                  className="text-center px-3 py-3 border-x-[0.5px] border-slate-300">
                  <Skeleton
                    variant="text"
                    width={cellIndex === 0 ? '30%' : '60%'}
                    height={20}
                    animation="wave"
                    sx={{ mx: 'auto' }}
                  />
                </td>
              ))}
              <td className="px-4 py-2 border-l-0 border-slate-300 align-middle">
                <div className="flex items-center justify-center">
                  <Skeleton
                    variant="rounded"
                    width={40}
                    height={40}
                    animation="wave"
                    sx={{ borderRadius: '8px' }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
