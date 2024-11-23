import Image from "next/image";
import MresalatLogo from "@/../public/images/home-page/mresalat_logo.svg";
import ProfileLogo from "@/../public/images/home-page/profile.webp";
import LogoutIcon from "@/../public/images/home-page/logout.svg";
import InfoIcon from "@/../public/images/home-page/info-icon.svg";
import Huze from "@/../public/images/home-page/huze-fix.svg";
import Etka from "@/../public/images/home-page/etka-fix.svg";
import Kish from "@/../public/images/home-page/kish-vand.svg";
import HeaderDesktop from "@/../public/images/home-page/new-mresalt-header.svg";
import MenuSidebar from "@/components/SideBar/MenuSidebar";
import CollapsibleMenu from "@/components/SideBar/CollapsibleMenu";

export default function MainPanel({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full gap-4">
      <div className="w-24 min-h-screen bg-white">
        <div className="flex flex-col gap-4 p-4">
          <Image
            src={MresalatLogo}
            alt="Mresalat_Logo"
            width={64}
            height={15}
          />
          <Image
            src={ProfileLogo}
            alt="Profile_Logo"
            width={64}
            height={64}
            className="rounded-full border-[2px] border-[#1758BA]"
          />
        </div>
        <div className="h-[520px] w-[80px] bg-cover bg-[url('/images/home-page/right_sidebar_bg.svg')]">
          <MenuSidebar />
        </div>
        <div className="flex flex-col gap-6 items-center justify-center p-4">
          <button>
            <Image src={InfoIcon} alt="Logout" width={24} height={24} />
          </button>
          <button className="flex item-center justify-center flex-col gap-1">
            <Image src={LogoutIcon} alt="Logout" width={24} height={24} />
            <span className="text-[10px] text-black font-bold">خروج</span>
          </button>
        </div>
      </div>
      <div className="w-[386px] min-h-screen bg-[#F7F7FF] px-5">
        <div className="mt-4 w-full">
          <Image
            src={HeaderDesktop}
            alt="header"
            width={100}
            height={82}
            className="w-full"
          />
        </div>
        <div className="flex justify-between mt-2 gap-2">
          <div className="cursor-pointer w-full">
            <Image
              src={Etka}
              width={110}
              height={35}
              alt="etka"
              className="w-full"
            />
          </div>
          <div className="cursor-pointer w-full">
            <Image
              src={Kish}
              width={115}
              height={35}
              alt="Kish"
              className="w-full"
            />
          </div>
          <div className="cursor-pointer w-full">
            <Image
              src={Huze}
              width={110}
              height={35}
              alt="Huze"
              className="w-full"
            />
          </div>
        </div>
        <div>
          <CollapsibleMenu />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
