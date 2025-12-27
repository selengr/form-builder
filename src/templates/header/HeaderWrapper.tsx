"use client";

import clsx from "clsx";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import Logo from "../../../public/images/logo/logo2.svg";
import MobileMenu from "@/components/MiddleSidebar/mobile/MobileMenu";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isSurvey = pathname.includes('survey-');

    const containerClasses = clsx(
        "flex grow md:mt-0",
        isSurvey
            ? "h-[100vh]"
            : "h-[calc(50vh-60px)] mt-[60px] md:h-[calc(100vh-0px)]"
    );

    return (
        <>
            {!isSurvey && (
                <div className="bg-white w-full mb-[60px] mx-auto px-4 py-3 flex justify-between items-center md:hidden fixed top-0 left-0 right-0 z-50">
                    <MobileMenu />
                    <Image
                        src={Logo}
                        alt="سایا لوگو"
                        width={120}
                        height={40}
                        priority
                        draggable={false}
                    />
                </div>
            )}

            <div className={containerClasses}>{children}</div>
        </>
    );
}
