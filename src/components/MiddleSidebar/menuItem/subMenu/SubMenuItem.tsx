import Link from "next/link";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { ISubMenuItemProps } from "@/types/menus";

const SubMenuItem = ({ id, href, icon, title, onClick }: ISubMenuItemProps) => (
  <div
    className="gap-1 bg-white transition-all w-full border-b border-[#DDE1E6] border-r-[#0066CC] border-r-4 py-4 rounded-[4px] duration-300 group pr-8"
    key={id}
    style={{ userSelect: "none" }}
  >
    <Link href={href} onClick={onClick} className="w-full flex items-center justify-between transition-all duration-200">
      <div className="flex items-center gap-2">
        <Image
          src={`/api/images?folder=menu&file=${icon}`}
          alt="icon"
          width={26}
          height={26}
          priority
          draggable={false}
          className={"group-hover:rotate-6 transition-all"}
        />
        <p className="text-[13px] text-black font-normal">{title}</p>
      </div>
      <IoIosArrowBack size="1rem" color="#292D32" className={"group-hover:ml-0.5 transition-all"} />
    </Link>
  </div>
);

export default SubMenuItem;
