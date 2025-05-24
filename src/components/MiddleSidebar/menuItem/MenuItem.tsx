
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

const MenuList = ({ menuLinks, staticLinks }) => {
  return (
    <>
      {menuLinks?.map((item) => (
        <div className="gap-4 w-full border-b border-[#DDE1E6] pb-4" key={item.id}>
          <Link href={item.a_attr?.href ?? "#"} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={`/images/home-page/menu/${item.icon}`} alt="icon" width={32} height={32} priority />
              <p className="text-[14px] text-black font-bold">{item.text}</p>
            </div>
            <IoIosArrowDown className="rotate-90" size="1.3rem" color="#292D32" />
          </Link>
        </div>
      ))}
      {staticLinks.map((item) => (
        <div className="gap-4 w-full border-b border-[#DDE1E6] pb-4" key={item.id}>
          <Link href={item.link} className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src={item.icon} alt="icon" width={32} height={32} priority />
              <p className="text-[14px] text-black font-bold">{item.title}</p>
            </div>
            <IoIosArrowDown className="rotate-90" size="1.3rem" color="#292D32" />
          </Link>
        </div>
      ))}
    </>
  );
};

export default MenuList;
