"use client";

import React, { useEffect, useState } from "react";
import { LuUserRoundPlus } from "react-icons/lu";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useParams } from "next/navigation";
// import { saveAs } from "file-saver";

interface StatsPaginationProps {
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  currentPage: number;
  rowsPerPage: number;
}

interface UserType {
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
  const { id } = useParams();
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

  const downloadExcel = () => {
    const header = "ردیف,شناسه,نام\n";
    const rows = savedUsers.map((u, i) => `${i + 1},${u.takePartId},${u.name}`);
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    // saveAs(blob, "users-list.csv");
  };

  return (
    <>
      <div className="bg-[#F7F7FF] w-full flex flex-wrap justify-between items-center px-4 py-2 mt-4 gap-2 rounded-lg">
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
            <MdKeyboardArrowRight className="text-blue-700 text-xl" />
          </button>
          <span className="text-sm">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-white border border-blue-700 rounded-full p-1 disabled:opacity-50"
          >
            <MdKeyboardArrowLeft className="text-blue-700 text-xl" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{totalItems} نفر در لیست</span>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl p-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm"
          >
            <LuUserRoundPlus className="text-white text-xl" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">لیست کاربران انتخاب‌شده</h2>

            {savedUsers.length === 0 ? (
              <p className="text-center text-gray-500">کاربری انتخاب نشده است.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedUsers.map((user, idx) => (
                  <li
                    key={user.takePartId}
                    className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm"
                  >
                    <span>{idx + 1}. {user.name}</span>
                    <button
                      onClick={() => handleDeleteUser(user.takePartId)}
                      className="text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={downloadExcel}
                disabled={savedUsers.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
              >
                دانلود اکسل
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md text-sm"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportPagination;