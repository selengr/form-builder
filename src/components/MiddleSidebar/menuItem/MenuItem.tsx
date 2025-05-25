
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { IoIosArrowDown } from "react-icons/io";
// public
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";


interface StaticLink {
    id: number;
    title: string;
    icon: StaticImageData;
    link: string;
  }
  

  interface IProps {
    menuLinks: any[];
  }

  const STATIC_LINKS: StaticLink[] = [
    { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
    { id: 5, title: "آموزش", icon: ChartSquare, link: "/underconstruction" },
    { id: 6, title: "ارتباط با ما", icon: GroupSquare, link: "/underconstruction" },
    { id: 8, title: "سوالات پرتکرار", icon: ShoppingCart,link: "/underconstruction"},
    { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "/underconstruction" },
  ];

  const MenuList: React.FC<IProps> = ({ menuLinks }) => {
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
      {STATIC_LINKS.map((item) => (
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
