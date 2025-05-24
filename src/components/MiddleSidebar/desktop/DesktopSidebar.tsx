"use client";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
// view
import MenuItem from "../menuItem/MenuItem";
// hooks
import { useUserInfo } from "@/hooks/useUserInfo";
// public
import Logo from "@/../public/images/home-page/psya-logo.svg";
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";
// services
import AxiosApi from "@/services/axios/AxiosApi";
// type
import { IMenuResponseData, IACLItem } from "../type";
interface StaticLink {
  id: number;
  title: string;
  icon: any;
  link: string;
}

const STATIC_LINKS: StaticLink[] = [
  { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
  { id: 5, title: "آموزش", icon: ChartSquare, link: "/underconstruction" },
  { id: 6, title: "ارتباط با ما", icon: GroupSquare, link: "/underconstruction" },
  { id: 8, title: "سوالات پرتکرار", icon: ShoppingCart,link: "/underconstruction"},
  { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "/underconstruction" },
];


export default function DesktopSidebar() {
  const { userInfo } = useUserInfo();
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState<IMenuResponseData | null>(null);

  const menuLinks = useMemo(() => {
    return menu?.aclList?.filter((i) => i.type === "menu") || [];
  }, [menu]);

  useEffect(() => {
    const loadMenu = async () => {
      if (userInfo) {
        setLoading(true)
        try {
          const { data } = await AxiosApi.get(
            "/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info",
            { baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA }
          );
          setMenu(data);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false)
        }
      }
    };
    loadMenu();
  }, [userInfo]);

  return (
    <div
      className="min-w-[400px] w-[400px] min-h-screen bg-white px-5 py-5 flex flex-col gap-8 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="w-full flex flex-col gap-5 items-center">
        <Image src={Logo} width={111} height={38} alt="Psya-Logo" priority />
        <div className="flex flex-col items-center w-full gap-5">
          {/*<SidebarRoleSelection />*/}
          <div className="mt-7" />
          <div className="w-full pr-3 flex flex-col gap-4">
            {menuLinks?.map((item: IACLItem) => (
              <MenuItem
                key={item.id}
                title={item.text}
                href={item.a_attr?.href ?? "#"}
                icon={`/images/home-page/menu/${item.icon}`}
              />
            ))}
            {STATIC_LINKS.map((item) => (
              <MenuItem
                key={item.id}
                title={item.title}
                href={item.link}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
