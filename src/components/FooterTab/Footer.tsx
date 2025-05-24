"use client";
import Image from "next/image";
import { MenuData } from "@/constants/Sidebar.constant";
import { usePathname } from "next/navigation";

export default function FooterTab() {
  const pathname = usePathname();
  const current = pathname.split("/")[2];

  return (
    <div className="fixed bottom-10 left-1/2 z-50 w-[90%] h-[77px] -translate-x-1/2 rounded-[28px] bg-[#070433] py-2 shadow-lg flex items-center justify-center">
      <div className="flex w-full justify-around px-[17px]">
        {MenuData.map(({ id, title, active, notActive, link }) => (
          <div
            key={id}
            className="flex flex-col items-center gap-[5px] cursor-pointer"
            onClick={() => (window.location.href = link)}
          >
            <Image
              src={current === link ? active : notActive}
              width={24}
              height={24}
              alt="footer-img"
              priority
              draggable={false}
            />
            <p className="text-[11px] text-center text-[#2CDFC9]">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
