"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import SidebarRoleSelection from "../SidebarRoleSelection/SidebarRoleSelection";
import Logo from "@/../public/images/home-page/psya-logo.svg";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";

import AxiosApi from "@/services/axios/AxiosApi";
import { IMenuResponseData, IACLItem } from "./type";
import { toast } from "sonner";

const staticLinks = [
  { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
  { id: 5, title: "آموزش", icon: ChartSquare, link: "" },
  { id: 6, title: "ارتباط با ما", icon: GroupSquare, link: "" },
  { id: 8, title: "سوالات پرتکرار", icon: ShoppingCart, link: "" },
  { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "" },
];

export default function MiddleSidebar() {
  const [menu, setMenu] = useState<IMenuResponseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { data } = await AxiosApi.get(
          "/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info",
          { baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA }
        );
        setMenu(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const renderLinkItem = (title: string, href: string, icon: any, key: string | number) => (
    <div
      key={key}
      className="gap-4 w-full border-b border-[#DDE1E6] pb-4"
    >
      <Link href={href} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={icon} alt="" width={32} height={32} />
          <p className="text-[14px] text-black font-bold">{title}</p>
        </div>
        <IoIosArrowDown className="rotate-90" size="1.3rem" color="#292D32" />
      </Link>
    </div>
  );

  return (
    <div className="min-w-[400px] w-[400px] min-h-screen bg-white px-5 py-5 flex flex-col gap-8 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      <div className="w-full flex flex-col gap-5 items-center">
        <Image fetchPriority="high" src={Logo} width={111} height={38} alt="Psya-Logo" />
        <div className="flex flex-col items-center w-full gap-5">
          <SidebarRoleSelection />
          <div className="w-full pr-3 flex flex-col gap-4">
            {!loading && menu?.aclList?.filter(i => i.type === "menu").map((item: IACLItem) =>
              renderLinkItem(item.text, item.a_attr?.href ?? "", `/images/home-page/menu/${item.icon}`, item.id)
            )}
            {staticLinks.map(item =>
              renderLinkItem(item.title, item.link, item.icon, item.id)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
