"use client";

import {Button} from "@mui/material";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="grow flex items-center justify-center bg-[#f9fafb]">
      <div className="flex flex-col items-center gap-6 p-10 rounded-2xl border border-gray-200 bg-white shadow-xl max-w-md w-full">

        <h2 className="text-gray-800 text-3xl font-semibold text-center font-iran-sans font-d6">
          بزودی در دسترس خواهد بود
        </h2>

        <p className="text-gray-600 text-center text-base leading-relaxed font-iran-sans font-d6">
          این صفحه هنوز آماده نیست، اما به‌زودی منتشر خواهد شد. ممنون از صبر و شکیبایی شما.
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
            href="/"
            className="text-white text-base no-underline"
          >
            بازگشت به خانه
          </Link>
        </Button>
      </div>
    </div>
  );
}
