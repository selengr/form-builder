import Image from "next/image";
import Logo from "@/../public/images/home-page/psya-logo.svg";
import SidebarRoleSelection from "../SidebarRoleSelection/SidebarRoleSelection";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import ChartSquare from "@/../public/images/home-page/menu/chart-square.svg";
import GroupSquare from "@/../public/images/home-page/menu/group-square.svg";
import MusicPlaylist from "@/../public/images/home-page/menu/music-playlist.svg";
import ShoppingCart from "@/../public/images/home-page/menu/shopping-cart.svg";
import Wallet from "@/../public/images/home-page/menu/wallet-minus.svg";
import AxiosApi from "@/services/axios/AxiosApi";
import { IMenuResponseData } from "./MiddleSidebar";
import { useEffect, useState } from "react";

const allLinks = [
  // { id: 1, title: "ساخت فرم", icon: Additem, link: "/builder" },
  { id: 2, title: "فرم‌های عمومی", icon: MusicPlaylist, link: "/public-form" },
  // {
  //   id: 3,
  //   title: "ارزیابی‌های من",
  //   icon: MusicPlaylist,
  //   link: "/my-assessments",
  // },
  // {
  //   id: 4,
  //   title: "گزارش ها",
  //   icon: MusicPlaylist,
  //   link: "/reports",
  // },
  { id: 5, title: "آموزش", icon: ChartSquare, link: "" },
  { id: 6, title: "ارتباط با ما", icon: GroupSquare, link: "" },
  // { id: 7, title: "تراکنش‌ها", icon: Wallet, link: "" },
  { id: 8, title: "سوالات پرتکرار", icon: ShoppingCart, link: "" },
  { id: 9, title: "قوانین و مقررات", icon: Wallet, link: "" },
  // { id: 10, title: "آپلودر", icon: Additem, link: "/uploader" },
];




export default function MiddleSidebar() {
  const [menu, setMenu] = useState<IMenuResponseData>();

  useEffect(()=>{
    const fetchData = async () => {
      try {
          const { data } = await AxiosApi.get(`/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info`, {
              baseURL: process.env.NEXT_PUBLIC_BASE_URL_PSYA
          });
          setMenu(data)
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };
  
  fetchData();
  
  },[])


  return (
    <div
      className="min-w-[400px] w-[400px] min-h-screen bg-white px-5 gap-8 flex flex-col py-5 overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <div className="w-full flex flex-col gap-5 items-center">
        <Image priority src={Logo} width={111} height={38} alt="Psya-Logo" />
        <div className="flex flex-col items-center w-full gap-5">
          <SidebarRoleSelection />
          <div className="w-full pr-3 flex flex-col gap-4">
          {menu?.aclList?.map((item : IACLItem) => (
              <>{item.type === "menu" && (<div
                key={item.id}
                className="gap-4 w-ful border-b-[1px] border-b-[#DDE1E6]"
              >
                <Link
                  href={item.a_attr.href??""}
                  className="w-full h-full pb-4 flex items-center justify-between "
                >
                  <div className="flex items-center justify-between gap-2">
                    <Image src={item.icon??""} alt="" width={32} height={32} />
                    <p className="text-[14px] text-black font-bold">
                      {item.data.langId}
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
              </div>)}</>
            ))}
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
