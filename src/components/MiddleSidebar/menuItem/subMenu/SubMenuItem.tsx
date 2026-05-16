import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { SubMenuIcon } from "../MenuIcon";
// type
import { ISubMenuItemProps } from "@/types/menus";

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
          <SubMenuIcon src={iconSrc} className="h-5 w-5 sm:h-6 sm:w-6" />
          <span
            className={`text-[11px] sm:text-[13px] leading-none ${
              isActive ? "text-[#0066CC] font-medium" : "text-[#222] font-medium"
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
