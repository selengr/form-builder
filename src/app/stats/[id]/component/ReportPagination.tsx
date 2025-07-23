"use client";

import React, {useEffect, useState} from "react";
import {LuUsers} from "react-icons/lu";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useParams} from "next/navigation";
import {ExcelDialog, UserCount} from "@/app/stats/[id]/component";
import {toast} from "sonner";

interface StatsPaginationProps {
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    currentPage: number;
    rowsPerPage: number;
}

export interface UserType {
    takePartId: number;
    name: string;
}

export function ReportPagination({
                                     totalItems,
                                     onPageChange,
                                     onRowsPerPageChange,
                                     currentPage,
                                     rowsPerPage,
                                 }: StatsPaginationProps) {
    const totalPages =
        rowsPerPage === -1 ? 1 : Math.ceil(totalItems / rowsPerPage);
    const {id} = useParams();
    const formId = JSON.parse(id as string);

    const [isOpen, setIsOpen] = useState(false);
    const [savedUsers, setSavedUsers] = useState<UserType[]>([]);

    useEffect(() => {
        if (isOpen) {
            const raw = localStorage.getItem("selectedUsersByForm");
            const data = raw ? JSON.parse(raw) : {};
            setSavedUsers(data[formId] || []);
        }
    }, [isOpen, formId]);

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

    const handleDeleteUser = (takePartId: number) => {
        const raw = localStorage.getItem("selectedUsersByForm");
        const data = raw ? JSON.parse(raw) : {};
        const updated = (data[formId] || []).filter(
            (u: UserType) => u.takePartId !== takePartId
        );
        data[formId] = updated;
        localStorage.setItem("selectedUsersByForm", JSON.stringify(data));
        setSavedUsers(updated);
    };

    const checkAndDownloadExcel = async () => {
        try {
            const checkRes = await fetch(`/api/report/check/${formId}`);
            const checkData = await checkRes.json();

            if (!checkRes.ok) {
                throw new Error(checkData.error || "بررسی فایل با خطا مواجه شد");
            }

            const status = checkData.statusEnum;
            const currentUserIds = savedUsers.map((u) => u.takePartId).sort((a, b) => a - b);

            const lastExportedRaw = localStorage.getItem(`lastExportedUserIds_${formId}`);
            const lastExportedUserIds: number[] = lastExportedRaw ? JSON.parse(lastExportedRaw) : [];

            const isSameList =
                lastExportedUserIds.length === currentUserIds.length &&
                lastExportedUserIds.every((id, index) => id === currentUserIds[index]);

            if (status === "PROCESSING") {
                toast.info("📄 فایل اکسل شما در حال آماده‌سازی است. لطفاً چند لحظه دیگر دوباره تلاش کنید.");
                return;
            }

            if (status === "SUCCESS" && checkData.filePath && isSameList) {
                const fullPath = checkData.filePath.startsWith("/")
                    ? checkData.filePath
                    : `/${checkData.filePath}`;
                const downloadUrl = `${window.location.origin}${fullPath}`;
                window.open(downloadUrl, "_blank");
                toast.success("فایل آماده بود و دانلود شد.");
            } else {
                const exportRes = await fetch('/api/report/exportexcel', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        takePartIdList: currentUserIds,
                    }),
                });

                const exportData = await exportRes.json();

                if (!exportRes.ok || !exportData.response) {
                    throw new Error(exportData.error || 'ارسال درخواست فایل اکسل با خطا مواجه شد.');
                }

                localStorage.setItem(
                    `lastExportedUserIds_${formId}`,
                    JSON.stringify(currentUserIds)
                );

                toast.success("درخواست تولید فایل اکسل با موفقیت ثبت شد.");
            }
        } catch (err: any) {
            console.error("Excel Check Error:", err);
            toast.error(err.message || "خطایی در بررسی فایل اکسل رخ داد.");
        }
    };

    return (
        <>
            <div
                className="bg-[#F7F7FF] w-full flex flex-wrap justify-between items-center px-4 py-2 mt-4 gap-2 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm">سطر قابل نمایش در هر صفحه:</span>
                    <select
                        className="bg-white rounded-md h-9 px-2 text-sm border border-gray-300 font-iran-sans"
                        value={rowsPerPage}
                        onChange={handleRowsChange}
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={10000}>همه</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="bg-white border border-blue-700 rounded-full p-1 disabled:opacity-50"
                    >
                        <MdKeyboardArrowRight className="text-blue-700 text-xl"/>
                    </button>
                    <span className="text-sm">
            صفحه {currentPage} از {totalPages}
          </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="bg-white border border-blue-700 rounded-full p-1 disabled:opacity-50"
                    >
                        <MdKeyboardArrowLeft className="text-blue-700 text-xl"/>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <UserCount formId={formId}/>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-xl p-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm"
                    >
                        <LuUsers className="text-white text-xl"/>
                    </button>
                </div>
            </div>

            {isOpen && (
                <ExcelDialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    savedUsers={savedUsers}
                    onDeleteUser={handleDeleteUser}
                    onDownload={() => {
                        checkAndDownloadExcel();
                        setIsOpen(false)
                    }}
                />
            )}
        </>
    );
}

export default ReportPagination;