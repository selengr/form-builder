'use client';
import { useEffect, useState } from 'react';
import { useStatsViewModel } from './viewModel';
import { useParams, useRouter } from 'next/navigation';
import { ReportHeader, ReportPagination, ReportTable } from '../../stats/[id]/component';

export interface UserType {
  name: string;
  takePartId: number;
}

export default function StatsPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params?.id?.toString();
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

  const {
    name,
    headData,
    refetchStatsData,
    allData,
    isLoading,
    page: currentPage,
    setPage: setCurrentPage,
    pageSize: rowsPerPage,
    setPageSize: setRowsPerPage,
    totalItems,
  } = useStatsViewModel();

  useEffect(() => {
    if (!formId) return;
    try {
      const raw = localStorage.getItem('selectedUsersByForm');
      const data = raw ? JSON.parse(raw) : {};
      setSelectedUsers(data[formId] || []);
    } catch {
      setSelectedUsers([]);
    }
  }, [formId]);

  const handleNavigation = () => {
    const address = localStorage.getItem('stats');
    router.push(address || '/reports');
  };

  const numericFormId = Number(formId);

  return (
    <div className="w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden">
      <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0">
        <ReportHeader title={name || 'گزارش'} onBack={handleNavigation} />

        <div className="flex-grow overflow-hidden min-w-0">
          <ReportTable
            refetchStatsData={refetchStatsData}
            headData={headData}
            allData={allData}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            formId={numericFormId}
          />
        </div>

        <ReportPagination
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          formId={numericFormId}
        />
      </div>
    </div>
  );
}
