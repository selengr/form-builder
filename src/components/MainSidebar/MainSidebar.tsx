"use client";

import Image from "next/image";
import MresalatLogo from "@/../public/images/home-page/mresalat_logo.svg";
import ProfileLogo from "@/../public/images/home-page/profile.webp";
import LogoutIcon from "@/../public/images/home-page/logout.svg";
import InfoIcon from "@/../public/images/home-page/info-icon.svg";
import HeaderDesktop from "@/../public/images/home-page/new-mresalt-header.svg";
import MenuSidebar from "@/components/SideBar/MenuSidebar";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function MainSidebar() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col justify-between w-24 bg-white">
        <div className="flex flex-col gap-4 items-center pt-4">
          <Link href="/">
            <Image
              src={MresalatLogo}
              alt="Mresalat_Logo"
              width={64}
              height={15}
            />
          </Link>
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
      <div className="min-w-[400px] w-[400px] min-h-screen bg-[#F7F7FF] px-5 gap-8 flex flex-col">
        <div className="mt-4 w-full">
          <Image
            src={HeaderDesktop}
            alt="header"
            width={100}
            height={100}
            className="w-full"
          />
        </div>
        <div className="w-full flex flex-col gap-4">
          <Button
            sx={{
              height: "56px",
              bgcolor: "#1758BA",
              boxShadow: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
                bgcolor: "#1758BA",
                boxShadow: "none",
              },
            }}
            fullWidth
            variant="contained"
            onClick={() => {
              router.push("/builder");
            }}
          >
            فرم ساز
          </Button>
        </div>
      </div>
    </>
  );
}
