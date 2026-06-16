'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ReportHeader, ReportPagination, ReportTable } from './component';
import { useStatsViewModel } from './viewModel';
import { useEffect, useState } from 'react';

export interface UserType {
  takePartId: number;
  name: string;
}

export default function StatsPage() {
  const router = useRouter();
  const params = useParams();
    const searchParams = useSearchParams();
  const search = searchParams.get('name');
  const formId = params?.id?.toString(); // اطمینان از string بودن id

  const { headData, allData, refetchStatsData, isLoading, page: currentPage, setPage: setCurrentPage, pageSize: rowsPerPage, setPageSize: setRowsPerPage, totalItems } = useStatsViewModel();

  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  useEffect(() => {
    if (formId) {
      const raw = localStorage.getItem('selectedUsersByForm');
      const data = raw ? JSON.parse(raw) : {};
      setSelectedUsers(data[formId] || []);
    }
  }, [formId]);
  
    const handleNavigation = () => {
    const address = localStorage.getItem("stats") ?? "/reports"
    router.push(address)
  }

  return (
    <div className='w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden'>
      <div className='flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0'>
        <ReportHeader title={search || 'گزارش'} onBack={handleNavigation} />

        <div className='flex-grow overflow-hidden min-w-0'>
          <ReportTable refetchStatsData={refetchStatsData} headData={headData} allData={allData} isLoading={isLoading} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} formId={Number(formId)} />
        </div>

        <ReportPagination
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          formId={Number(formId)}
        />
      </div>
    </div>
  );
}
