"use client";

import Image from "next/image";
import { CircleLoading } from "@/components";
import React from "react";

const LoadingCart = () => {
    return (
        <div
            dir="rtl"
            className="w-full h-full flex items-center justify-center bg-white"
        >
            <div className="max-w-[600px] w-full px-6">
                <div className="">
                    <CircleLoading text="در حال بارگذاری..." />
                </div>
            </div>
        </div>
    );
};

export default LoadingCart;