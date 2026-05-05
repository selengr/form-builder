import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { ISubMenuItemProps } from "@/types/menus";
import { MenuIcon } from "../MenuIcon";

const SubMenuItem = React.memo(
  ({ href, icon, title, onClick }: ISubMenuItemProps) => {
    const pathname = usePathname();
    const iconSrc = `/api/images?folder=menu&file=${icon}`;
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        onClick={onClick}
        style={{ userSelect: "none" }}
        className={`
          group flex items-center justify-between w-full
          px-5 py-3 rounded-md
          border-b border-[#E4E7EB]
          transition-all duration-200 ease-out
          ${isActive
            ? "bg-[#F3F8FF] border-r-4 border-r-[#0066CC]"
            : "bg-white hover:bg-[#F3F6FA] active:bg-[#E8EDF4]"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <MenuIcon src={iconSrc} size={22} />
          <span
            className={`text-[12px] leading-none ${
              isActive ? "text-[#0066CC] font-medium" : "text-[#222] font-normal"
            }`}
          >
            {title}
          </span>
        </div>

        <IoIosArrowBack
          size="1rem"
          color={isActive ? "#0066CC" : "#292D32"}
          className="opacity-60 transition-all group-hover:translate-x-[-2px]"
        />
      </Link>
    );
  }
);

export default SubMenuItem;
