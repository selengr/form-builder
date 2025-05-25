"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
// hooks
import { useUserInfo, useMenu } from "@/hooks";
// public
import Logo from "@/../public/images/home-page/psya-logo.svg";


import MenuList from "./menuItem/MenuItem";
import MenuItemSkeleton from "./menuItemSkeleton";


export default function MiddleSidebar() {
  const { userInfo } = useUserInfo();
  const { menu, loading } = useMenu(userInfo)

  const menuLinks = useMemo(() => {
    return menu?.aclList?.filter((i) => i.type === "menu") || [];
  }, [menu]);

 

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
            {loading && <MenuItemSkeleton />}
            <MenuList menuLinks={menuLinks} />
          </div>  
        </div>
      </div>
    </div>
  );
}
