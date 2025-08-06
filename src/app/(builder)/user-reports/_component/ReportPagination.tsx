'use client';

import { LuUsers } from 'react-icons/lu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface StatsPaginationProps {
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  currentPage: number;
  rowsPerPage: number;
}

export function ReportPagination({ totalItems, onPageChange, onRowsPerPageChange, currentPage, rowsPerPage }: StatsPaginationProps) {
  const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(totalItems / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onRowsPerPageChange(Number(value));
    onPageChange(1);
  };

  return (
    <div className='bg-[#F7F7FF] w-full flex flex-wrap justify-between items-center px-4 py-2 mt-4 gap-2 rounded-lg'>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>سطر قابل نمایش در هر صفحه:</span>
        <select className='bg-white rounded-md h-9 px-2 text-sm border border-gray-300 font-iran-sans' value={rowsPerPage} onChange={handleRowsChange}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={10000}>همه</option>
        </select>
      </div>
      <div className='flex items-center gap-2'>
        <button onClick={handlePrev} disabled={currentPage === 1} className='bg-white border border-blue-700 rounded-full p-1 disabled:opacity-50'>
          <MdKeyboardArrowRight className='text-blue-700 text-xl' />
        </button>
        <span className='text-sm'>
          صفحه {currentPage} از {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages} className='bg-white border border-blue-700 rounded-full p-1 disabled:opacity-50'>
          <MdKeyboardArrowLeft className='text-blue-700 text-xl' />
        </button>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm'>{totalItems} نفر در لیست</span>
        <div className='bg-blue-700 p-2 rounded-lg'>
          <LuUsers className='text-white text-xl' />
        </div>
      </div>
    </div>
  );
}

export default ReportPagination;
