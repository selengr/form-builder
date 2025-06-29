"use client";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 3000)
    return () => {
      clearTimeout(timeout);
    }
  }, [router]);
  return (
    <div className="grow flex items-center justify-center bg-[#f9fafb]">
      <div className="flex flex-col grow items-center gap-6 p-10 rounded-2xl border border-gray-200 bg-white shadow-lg max-w-sm w-full">
        <Image src={"https://newmhesam.mresalat.ir/_next/static/media/header-mhesam.36e4c7a2.svg"} alt={""} height={100} width={100} style={{
          filter: 'brightness(0) saturate(100%) invert(29%) sepia(93%) saturate(2175%) hue-rotate(200deg) brightness(97%) contrast(101%)', // مثلاً برای آبی کردن آیکون مشکی
        }}/>
        <p className="text-gray-500 text-sm "> در حال انتقال ...</p>
      </div>
    </div>
  );
}
