"use client";

import React, {useEffect, useState} from "react";
import {Tooltip} from "@mui/material";
import {ImSpinner2} from "react-icons/im";
import {LuFileChartPie, LuUserMinus, LuUserPlus} from "react-icons/lu";
import {useParams} from "next/navigation";
import {toast} from "sonner";

// api
import {usePostCondition} from "../show-result/hooks/usePostCondition";

interface StatsTableProps {
    headData: any[];
    allData: any[];
    isLoading: boolean;
}

interface UserType {
    takePartId: number;
    name: string;
}

export function ReportTable({headData, allData, isLoading}: StatsTableProps) {
    const {mutate} = usePostCondition();
    const {id} = useParams();
    const formId = JSON.parse(id as string);

    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

    const actionColumnWidth = "120px";
    const dataColumnMinWidth = "100px";

    useEffect(() => {
        const raw = localStorage.getItem("selectedUsersByForm");
        const data = raw ? JSON.parse(raw) : {};
        setSelectedUsers(data[formId] || []);
    }, [formId]);

    const isUserSelected = (takePartId: number) => {
        return selectedUsers.some((u) => u.takePartId === takePartId);
    };

    const toggleSelectedUser = (user: UserType) => {
        const key = "selectedUsersByForm";
        const raw = localStorage.getItem(key);
        const data: Record<string, UserType[]> = raw ? JSON.parse(raw) : {};

        const existing = data[formId] || [];
        const alreadyAdded = existing.some((u) => u.takePartId === user.takePartId);

        if (alreadyAdded) {
            const updated = existing.filter((u) => u.takePartId !== user.takePartId);
            data[formId] = updated;
            localStorage.setItem(key, JSON.stringify(data));
            setSelectedUsers(updated);
            toast.info("کاربر حذف شد");
        } else {
            const updated = [...existing, user];
            data[formId] = updated;
            localStorage.setItem(key, JSON.stringify(data));
            setSelectedUsers(updated);
            toast.success("کاربر اضافه شد");
        }
    };

    const handleShowResult = (takePartId: number) => {
        mutate({
            data: [{
                formId, takePartId,
            },],
        });
    };

    return (<div className="w-full h-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden min-w-0">
        {isLoading ? (<div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500">
            <ImSpinner2 className="animate-spin h-12 w-12 text-blue-600 mb-4"/>
            <p className="text-lg font-semibold">در حال بارگذاری اطلاعات...</p>
        </div>) : allData.length === 0 ? (
            <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-500">
                <LuFileChartPie className="h-16 w-16 text-gray-400 mb-4"/>
                <p className="text-lg font-semibold">داده‌ای برای نمایش یافت نشد.</p>
                <p className="text-sm text-gray-400">لطفاً فیلترهای خود را بررسی کنید.</p>
            </div>) : (<div className="w-full h-full overflow-x-auto min-w-0">
            <table className="table-auto min-w-full border-collapse border border-gray-200">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                <tr>
                    {headData.map((item, index) => (<Tooltip
                        key={item.questionId + Math.random()}
                        title={item.questionTitle}
                        followCursor
                        arrow
                        enterDelay={1000}
                        placement="top"
                    >
                        <th
                            className="px-4 py-3 text-sm font-semibold text-gray-700 text-center truncate border-r border-neutral-200 max-w-[300px]"
                            style={{minWidth: dataColumnMinWidth}}
                        >
                            <div className="truncate" title={item.questionTitle} dir="rtl">
                                {item.questionTitle}
                            </div>
                        </th>
                    </Tooltip>))}
                </tr>
                </thead>
                <tbody>
                {allData.map((row, rowIndex) => {
                    const takePartId = row.row[1]?.takePartId;
                    const name = row.row[1]?.answer[0];
                    const isSelected = isUserSelected(takePartId);

                    return (<tr
                        key={row.row[0]?.questionId + Math.random() || rowIndex}
                        className={`${rowIndex % 2 !== 0 ? "bg-neutral-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-300 max-w-[150px]`}
                    >
                        {row.row.map((data: { answer: any[] }, i: number) => (<td
                            key={i}
                            className="px-4 py-2 text-sm text-gray-800 text-center border-b border-r border-gray-200 align-top max-w-[150px]"
                            style={{minWidth: dataColumnMinWidth}}
                        >
                            <Tooltip
                                title={Array.isArray(data.answer) ? data.answer.join(" - ") : String(data.answer)}
                                followCursor
                                arrow
                                enterDelay={600}
                                leaveDelay={100}
                                placement="top"
                            >
                                <div
                                    className="overflow-hidden text-ellipsis"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                        wordBreak: "break-word",
                                        whiteSpace: "normal",
                                    }}
                                >
                                    {Array.isArray(data.answer) ? data.answer.join(" - ") : String(data.answer)}
                                </div>
                            </Tooltip>
                        </td>))}
                        <td
                            className="px-4 py-2 text-center border-b border-r border-gray-200 align-middle"
                            style={{minWidth: actionColumnWidth}}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => toggleSelectedUser({takePartId, name})}
                                    className={`rounded-xl p-2 text-white transition-colors duration-200 shadow-sm ${isSelected ? "bg-red-500 hover:bg-red-600" : "bg-teal-500 hover:bg-teal-600"}`}
                                >
                                    {isSelected ? <LuUserMinus className="w-5 h-5"/> :
                                        <LuUserPlus className="w-5 h-5"/>}
                                </button>
                                <button
                                    onClick={() => handleShowResult(takePartId)}
                                    className="rounded-xl p-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm"
                                >
                                    <LuFileChartPie className="w-5 h-5"/>
                                </button>
                            </div>
                        </td>
                    </tr>);
                })}
                </tbody>
            </table>
        </div>)}
    </div>);
}

export default ReportTable;