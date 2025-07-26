"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import usePreview from "@/hooks/usePreview";
import { useEffect } from "react";
import PreviewQuestion from "@/templates/preview/PreviewQuestion";
import PreviewProgress from "@/templates/preview/PreviewProgress";
import Loading from "./loading";
import { Button, IconButton } from "@mui/material";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function PreviewPage() {
  const router = useRouter();
  const { id: paramId } = useParams();
  const { status, title } = usePreview();
  const searchParams = useSearchParams()
  const search = searchParams.get('rep')
  const admin = search === "list"


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (status === "loading") {
    return (<div className="w-full h-screen flex justify-center items-center bg-white">
      <Loading />
    </div>);
  }

  if (status === "notExist") {
    return (<div className="w-full h-screen flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          هنوز سوالی ساخته نشده است
        </h2>
        <Button
          variant="contained"
          onClick={() => router.push(`/builder/${paramId}`)}
          sx={{
            backgroundColor: "#111", "&:hover": { backgroundColor: "#222" },
          }}
        >
          بازگشت به فرم ساز
        </Button>
      </div>
    </div>);
  }

  return (<div className="p-2">
    <div className="w-full h-[calc(100vh-1rem)] flex flex-col p-4 bg-white rounded-xl">
      {/* Header */}
      <div className="w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative">
        <IconButton
          sx={{ position: "absolute", left: "8px" }}
          onClick={() => router.push(admin ? `/user-reports/${paramId}` : `/builder/${paramId}`)}
        >
          <MdOutlineKeyboardArrowRight color="#292D32" />
        </IconButton>
        <p className="text-[16px] text-center font-bold text-[#161616]">
          {title}
        </p>
      </div>

      {/* Main content (centered 60%) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[60%] flex items-center justify-center">
          <PreviewQuestion />
        </div>
      </div>

      {/* Footer always at bottom */}
      <div className="w-full flex justify-between items-center ">
        <PreviewProgress />
      </div>
    </div>
  </div>);
}
