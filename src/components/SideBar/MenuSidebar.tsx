"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuData } from "@/constants/Sidebar.constant";

export default function MenuSidebar() {
  const current = usePathname().split("/")[2];

  return (
    <div className="flex flex-col gap-8 pt-[82px]">
      {MenuData.map(({ id, title, active, notActive, link }) => {
        const isActive = current === link;

        return (
          <div
            key={id}
            className="flex flex-col items-center gap-[5px] cursor-pointer"
            onClick={() => (window.location.href = link)}
          >
            <Image
              src={current === link ? active : notActive}
              width={28}
              height={28}
              priority
              alt="logo-side-bar"
            />
            <p className={`text-[9px] ${isActive ? "text-[#2CDFC9]" : "text-[#F2F4F8]"}`}>
              {title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
