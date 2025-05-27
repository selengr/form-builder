"use client";

import {signIn, signOut} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import MenuSidebar from "@/components/SideBar/MenuSidebar";
import MiddleSidebar from "../MiddleSidebar/MiddleSidebar";
import Avatar from "@/components/Avatar/Avatar";
import {useUserInfo} from "@/hooks/useUserInfo";
import MresalatLogo from "@/../public/images/home-page/mresalat_logo.svg";
import LogoutIcon from "@/../public/images/home-page/logout.svg";
import InfoIcon from "@/../public/images/home-page/info-icon.svg";

const SidebarButton = ({icon, label, onClick}: { icon: JSX.Element; label: string; onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 min-h-[40px]">
    {icon}
    <span className="text-[10px] font-bold text-black">{label}</span>
  </button>);

export default function MainSidebar() {
  const {userInfo, loading} = useUserInfo();
  const avatar = userInfo?.user?.fullName;
  const endPoint = process.env.NEXT_PUBLIC_MRESALAT_ENDPOINT + "/";

  const handleAuth = async () => {
    if (!userInfo) return signIn("authorize");
    await signOut({redirect: false});
    toast.success("خروج با موفقیت انجام شد");
    location.replace("/");
  };

  return (<>
      <div className="flex flex-col justify-between min-w-[100px] bg-white overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Link href={endPoint}>
            <Image src={MresalatLogo} alt="Mresalat_Logo" width={64} height={15} priority/>
          </Link>
          <Link href={endPoint + "profile"}>
            {loading ? (<div className="w-16 h-16 bg-neutral-200 border-2 border-blue-600 rounded-full"/>) : avatar ? (
              <Avatar size="lg" name={avatar}/>) : (<div className="w-16 h-16 bg-neutral-200 border-2 border-blue-600 rounded-full"/>)}
          </Link>
        </div>

        {/* Middle */}
        <div className="relative h-[520px] w-[80px] min-h-[520px]">
          <Image
            src="/images/home-page/right_sidebar_bg.svg"
            alt="Sidebar Background"
            fill
            className="object-cover z-0"
            priority
          />
          <div className="relative z-10">
            <MenuSidebar/>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col gap-2 items-start pr-5 justify-center p-4">
          <SidebarButton icon={<Image src={InfoIcon} alt="Info" width={24} height={24} draggable={false}/>} label=""/>
          <SidebarButton
            icon={loading ? (<div className="w-6 h-6 bg-neutral-200 rounded-full animate-pulse"/>) : (<Image
                className={userInfo ? "rotate-180" : ""}
                src={LogoutIcon}
                alt="Logout"
                width={24}
                height={24}
              />)}
            label={loading ? "..." : userInfo ? "خروج" : "ورود"}
            onClick={handleAuth}
          />
        </div>
      </div>

      <MiddleSidebar/>
    </>);
}
