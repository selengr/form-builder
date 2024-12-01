"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";

export default function BuilderErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-5">
      <h2 className="text-destructive text-4xl">خطایی رخ داده است</h2>
      <Button
        variant="outlined"
        sx={{ borderRadius: "10px", height: "50px", px: "16px" }}
      >
        <Link href="/builder" className="text-[16px] font-bold">
          بازگشت به فرم ساز
        </Link>
      </Button>
    </div>
  );
}
