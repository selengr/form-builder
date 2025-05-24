import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

interface IProps {
  title: string;
  href: string;
  icon: string;
}

const MenuItem: React.FC<IProps> = ({ title, href, icon }) => (
  <div className="gap-4 w-full border-b border-[#DDE1E6] pb-4">
    <Link href={href} className="w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src={icon} alt="icon" width={32} height={32} priority />
        <p className="text-[14px] text-black font-bold">{title}</p>
      </div>
      <IoIosArrowDown className="rotate-90" size="1.3rem" color="#292D32" />
    </Link>
  </div>
);

export default MenuItem;
