"use client";

import {useEffect} from "react";
import Link from "next/link";
import {Button} from "@mui/material";

export default function BuilderErrorPage({error}: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="flex flex-col items-center gap-6 p-10 rounded-2xl border border-gray-200 bg-white shadow-xl max-w-lg w-full">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-gray-800 text-2xl font-semibold text-center">خطایی در بارگذاری سامانه رخ داده است</h2>
        <p className="text-gray-600 text-center text-base leading-relaxed">
          با عرض پوزش، در فرآیند بارگذاری فرم‌ساز مشکلی به وجود آمده است. لطفاً مجدداً تلاش نمایید یا در صورت تداوم مشکل، با تیم پشتیبانی تماس
          بگیرید.
        </p>
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            height: "48px",
            px: "24px",
            fontWeight: "bold",
            backgroundColor: "#2563eb",
            textTransform: "none",
            '&:hover': {
              backgroundColor: "#1e40af"
            }
          }}
        >
          <Link
            href="/builder"
            className="text-white text-base no-underline"
          >
            بازگشت به فرم‌ساز
          </Link>
        </Button>
      </div>
    </div>
  );
}
