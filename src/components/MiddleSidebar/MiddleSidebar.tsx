import Image from "next/image";
import Logo from "@/../public/images/home-page/psya-logo.svg";
import SidebarRoleSelection from "../SidebarRoleSelection/SidebarRoleSelection";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Additem from "@/../public/images/home-page/menu/additem.svg";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";

const allLinks = [
  { id: 1, title: "ساخت فرم", icon: Additem, link: "/builder" },
  { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
  {
    id: 2,
    title: "ارزیابی‌های من",
    icon: MusicPlaylist,
    link: "/my-assessments",
  },
  { id: 3, title: "آموزش", icon: ChartSquare, link: "" },
  { id: 4, title: "ارتباط با ما", icon: GroupSquare, link: "" },
  { id: 5, title: "تراکنش‌ها", icon: Wallet, link: "" },
  { id: 6, title: "سوالات پرتکرار", icon: ShoppingCart, link: "" },
  { id: 7, title: "قوانین و مقررات", icon: Wallet, link: "" },
  { id: 8, title: "آپلودر", icon: Additem, link: "/uploader" },
];

export default function MiddleSidebar() {
  return (
    <div className="min-w-[400px] w-[400px] min-h-screen bg-white px-5 gap-8 flex flex-col py-5">
      <div className="w-full flex flex-col gap-5 items-center">
        <Image priority src={Logo} width={111} height={38} alt="Psya-Logo" />
        <div className="flex flex-col items-center w-full gap-5">
          <SidebarRoleSelection />
          <div className="w-full pr-3 flex flex-col gap-4">
            {allLinks.map((item) => (
              <div
                key={item.id}
                className="gap-4 w-ful border-b-[1px] border-b-[#DDE1E6]"
              >
                <Link
                  href={item.link}
                  className="w-full h-full pb-4 flex items-center justify-between "
                >
                  <div className="flex items-center justify-between gap-2">
                    <Image src={item.icon} alt="" width={32} height={32} />
                    <p className="text-[14px] text-black font-bold">
                      {item.title}
                    </p>
                  </div>
                  <div>
                    <IoIosArrowDown
                      size="1.3rem"
                      color="#292D32"
                      width={32}
                      height={32}
                      className="rotate-90"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
