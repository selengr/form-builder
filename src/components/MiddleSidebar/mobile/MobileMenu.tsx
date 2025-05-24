"use client";
import Image from "next/image";
import { CgClose } from "react-icons/cg";
import { IconButton, Drawer } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import MenuItem from "../menuItem/MenuItem";
// hooks
import { useUserInfo } from "@/hooks/useUserInfo";
// public
import Logo from "@/../public/images/home-page/psya-logo.svg";
import MenuIcon from "@/../public/images/home-page/menu/ic_menu.svg";
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
  {
    id: 6,
    title: "ارتباط با ما",
    icon: GroupSquare,
    link: "/underconstruction",
  },
  {
    id: 8,
    title: "سوالات پرتکرار",
    icon: ShoppingCart,
    link: "/underconstruction",
  },
  { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "/underconstruction" },
];

const MobileMenu = () => {
  const { userInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [menu, setMenu] = useState<IMenuResponseData | null>(null);

  const menuLinks = useMemo(() => {
    return menu?.aclList?.filter((i) => i.type === "menu") || [];
  }, [menu]);

  useEffect(() => {
    const loadMenu = async () => {
      if (userInfo) {
        try {
          const { data } = await AxiosApi.get(
            "/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info",
            { baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA }
          );
          setMenu(data);
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
    };
    loadMenu();
  }, [userInfo]);

  const toggleDrawer = () => {
    setIsRotated((prev) => !prev);
   setTimeout(() => {
    setOpen((prev) => !prev);
   }, 300);
  };

  const list = () => (
    <>
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
    </>
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
      >
        <Image src={MenuIcon} alt="icon" width={32} height={32} priority />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div
          className="max-w-[400px] min-w-[370px] min-h-screen bg-white px-5 py-5 flex flex-col gap-8 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="w-full flex flex-col gap-10 items-start">
            <div className="flex flex-row justify-between w-full">
              <Image
                src={Logo}
                width={111}
                height={38}
                alt="Psya-Logo"
                priority
              />
              <IconButton edge="end">
                <CgClose
                  color="#404040"
                  width={25}
                  height={20}
                  size="1.5rem"
                  onClick={toggleDrawer}
                  style={{
                    transition: "transform 0.3s",
                    transform: isRotated ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </IconButton>
            </div>
            <div className="flex flex-col items-start w-full gap-5">
              {list()}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileMenu;
