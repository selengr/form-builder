"use client";
import { useRouter } from "next/navigation";
import { formStatusPersian, formTypePersian } from "@/constants/formDictionaries";
import { InfoRow } from "@/components/common/infoRow";
import React, { useState } from "react";

// MUI imports (نسخه ۶)
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { GoInfo } from "react-icons/go";

interface FormCardBaseProps {
  data: any;
  buttonText: string;
  buttonLink?: string | ((id: string) => string);
}

export default function FormCardBase({ data, buttonText, buttonLink }: FormCardBaseProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!buttonLink) return;
    const href = typeof buttonLink === "function" ? buttonLink(data.id) : buttonLink;
    router.push(href);
  };

  const handleMenuOpen = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/report");
      if (!res.ok) throw new Error("Failed to fetch report options");

      const json = await res.json();
      const list = json.responseModelList;

      if (Array.isArray(list)) {
        setReportData(list);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message || "خطا در دریافت داده");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = async (key: string) => {
    handleMenuClose();
    console.log("Selected report key:", key);
    // می‌تونی اینجا POST بزنی به /api/destroy-report
  };

  return (
    <div className="border-[1px] flex flex-col gap-3 rounded-[20px] border-[#DDE1E6] p-4 w-full max-w-full relative">
      {/* آیکن گزارش */}
      <div className="absolute top-2 left-2 z-10">
        <IconButton onClick={handleMenuOpen} size="medium">
          <GoInfo />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
              <span className="ml-2">در حال بارگذاری...</span>
            </MenuItem>
          ) : error ? (
            <MenuItem disabled className="text-red-500">
              {error}
            </MenuItem>
          ) : Array.isArray(reportData) && reportData.length > 0 ? (
            reportData.map((item: any, i: number) => (
              <MenuItem key={i} onClick={() => handleReport(item.key)}>
                {item.key.split(".").pop() }
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>داده‌ای یافت نشد</MenuItem>
          )}
        </Menu>
      </div>

      {/* اطلاعات فرم */}
      <InfoRow label="نام:" value={data.name} bold />
      <InfoRow label="نوع:" value={formTypePersian[data.type]} bold />
      <InfoRow label="دسترسی:" value={data.accessType || "عمومی"} bold />
      <InfoRow label="وضعیت:" value={formStatusPersian[data.status]} bold />

      {/* دکمه اصلی */}
      <div className="flex w-full gap-2">
        <button
          className="bg-[#1758BA] hover:bg-[#216ee1] transition-all duration-200 max-w-full sm:max-w-[200px] px-2 h-[42px] w-full text-[14px] rounded-lg text-white"
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
