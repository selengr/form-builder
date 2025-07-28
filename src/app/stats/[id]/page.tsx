"use client";

import { useRouter } from "next/navigation";
import { ReportHeader, ReportPagination, ReportTable } from "./component";
import { useStatsViewModel } from "./viewModel";
import { useEffect, useState } from "react";

export interface UserType {
    takePartId: number;
    name: string;
}

export default function StatsPage() {
    const router = useRouter();
    const {
        formData,
        headData,
        allData,
        isLoading,
        page: currentPage,
        setPage: setCurrentPage,
        pageSize: rowsPerPage,
        setPageSize: setRowsPerPage,
        totalItems,
    } = useStatsViewModel();

    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const formId = formData?.id;

    useEffect(() => {
        if (formId) {
            const raw = localStorage.getItem("selectedUsersByForm");
            const data = raw ? JSON.parse(raw) : {};
            setSelectedUsers(data[formId] || []);
        }
    }, [formId]);

    return (
        <div className="w-0 grow flex flex-col md:p-4 p-2 overflow-x-hidden">
            <div className="flex-grow bg-white rounded-xl p-4 overflow-hidden flex flex-col min-w-0">
                <ReportHeader
                    title={formData.name || "گزارش"}
                    onBack={() => router.push("/reports")}
                />

                <div className="flex-grow overflow-hidden min-w-0">
                    <ReportTable
                        headData={headData}
                        allData={allData}
                        isLoading={isLoading}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                        formId={formId}
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
                    formId={formId}
                />
            </div>
        </div>
    );
}