"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "/public/images/logo/logo2.svg";
import MobileMenu from "@/components/MiddleSidebar/mobile/MobileMenu";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSurvey = pathname.includes("survey-");

  const containerClasses = clsx(
    "flex grow md:mt-0",
    isSurvey
      ? "min-h-screen"
      : "min-h-[calc(100vh-75px)] mt-[75px] md:mt-0 md:min-h-screen overflow-hidden"
  );

  return (
    <>
      {!isSurvey && (
        <div className="bg-white w-full mx-auto px-4 py-3 flex justify-between items-center md:hidden fixed top-0 left-0 right-0 z-50 shadow-sm">
          <MobileMenu />

          <Link href="/" aria-label="بازگشت به خانه" className="cursor-pointer">
            <Image
              src={Logo}
              alt="سایا لوگو"
              width={120}
              height={40}
              priority
              draggable={false}
            />
          </Link>
        </div>
      )}

      <div className={containerClasses}>{children}</div>
    </>
  );
}
