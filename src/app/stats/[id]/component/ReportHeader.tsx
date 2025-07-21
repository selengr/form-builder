"use client";
import {IconButton} from "@mui/material";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";

interface StatsHeaderProps {
  title: string;
  onBack: () => void;
}

export function ReportHeader({title, onBack}: StatsHeaderProps) {
  return (<div
    className="w-full min-h-[52px] flex items-center justify-center gap-4 rounded-xl bg-[#F7F7FF] px-2 mb-4 relative">
    <IconButton
      sx={{position: "absolute", left: "8px"}}
      onClick={onBack}
    >
      <MdOutlineKeyboardArrowRight color="#292D32"/>
    </IconButton>
    <p className="text-[16px] text-center font-bold text-[#161616]">
      {title}
    </p>
  </div>);
}

export default ReportHeader;
