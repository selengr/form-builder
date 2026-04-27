import React from "react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { ISubMenuItemProps } from "@/types/menus";
// component
import { MenuIcon } from "../MenuIcon";

const SubMenuItem = React.memo(
  ({ id, href, icon, title, onClick }: ISubMenuItemProps) => {
    const iconSrc = `/api/images?folder=menu&file=${icon}`;

    return (
      <div
        className="w-full bg-white border-b border-[#DDE1E6] border-r-4 border-r-[#0066CC]
                   py-4 pr-8 rounded-[4px] group transition-all"
        style={{ userSelect: "none" }}
      >
        <Link
          href={href}
          onClick={onClick}
          className="w-full flex items-center justify-between transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <MenuIcon src={iconSrc} size={26} />
            <p className="text-[13px] text-black font-normal">{title}</p>
          </div>

          <IoIosArrowBack
            size="1rem"
            color="#292D32"
            className="group-hover:ml-0.5 transition-all"
          />
        </Link>
      </div>
    );
  }
);

export default SubMenuItem;
