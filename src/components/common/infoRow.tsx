import React from "react";

export function InfoRow({
                     label, value, bold = false,
                 }: {
    label: string; value: React.ReactNode; bold?: boolean;
}) {
    return (<div className="flex gap-1 text-[#393939]">
        <span className="text-sm">{label}</span>
        <p className={`text-sm ${bold ? "font-bold" : ""}`}>{value}</p>
    </div>);
}
