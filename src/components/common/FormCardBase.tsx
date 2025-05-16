// components/common/FormCardBase.tsx
"use client";
import { useRouter } from "next/navigation";
import { formStatusPersian, formTypePersian } from "@/constants/formDictionaries";
import {InfoRow} from "@/components/common/infoRow";
import React from "react";

interface FormCardBaseProps {
    data: any;
    buttonText: string;
    buttonLink?: string | ((id: string) => string);
}

export default function FormCardBase({ data, buttonText, buttonLink }: FormCardBaseProps) {
    const router = useRouter();
    const handleClick = () => {
        if (!buttonLink) return;
        const href = typeof buttonLink === "function" ? buttonLink(data.id) : buttonLink;
        router.push(href);
    };

    return (
        <div className="border-[1px] flex flex-col gap-3 rounded-[20px] border-[#DDE1E6] p-4">
            <div className="flex gap-1 text-[#393939]">
                <span className="text-[14px]">نام:</span>
                <p
                    className="text-[14px] font-bold"
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                    {data.name}
                </p>
            </div>
            <InfoRow label="نوع:" value={formTypePersian[data.type]} bold/>
            <InfoRow label="دسترسی:" value={data.accessType || "عمومی"} bold/>
            <InfoRow label="وضعیت:" value={formStatusPersian[data.status]} bold/>
            <div className="flex w-full gap-2">
                <button
                    className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-[200px] px-2 h-[36px] w-full text-[14px] rounded-lg text-white"
                    onClick={handleClick}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
