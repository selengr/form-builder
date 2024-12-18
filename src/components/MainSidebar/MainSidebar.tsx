"use client";

import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import { signIn, signOut } from "next-auth/react";
import MenuSidebar from "@/components/SideBar/MenuSidebar";
import MiddleSidebar from "../MiddleSidebar/MiddleSidebar";
import MresalatLogo from "@/../public/images/home-page/mresalat_logo.svg";
import ProfileLogo from "@/../public/images/home-page/profile.webp";
import LogoutIcon from "@/../public/images/home-page/logout.svg";
import InfoIcon from "@/../public/images/home-page/info-icon.svg";

export default function MainSidebar() {
  return (
    <>
      <Box
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          overflowY: "auto",
          minWidth: "100px",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        bgcolor="white"
      >
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
        <div className="h-[520px] min-h-[520px] w-[80px] bg-cover bg-[url('/images/home-page/right_sidebar_bg.svg')]">
          <MenuSidebar />
        </div>
        <div className="flex flex-col gap-6 items-start pr-5 justify-center p-4">
          <button>
            <Image src={InfoIcon} alt="Logout" width={24} height={24} />
          </button>
          <button
            onClick={async () => {
              await signIn("authorize");
            }}
            className="flex items-baseline justify-center flex-col gap-1"
          >
            <Image
              className="rotate-180"
              src={LogoutIcon}
              alt="Logout"
              width={24}
              height={24}
            />
            <span className="text-[10px] text-black font-bold flex items-center justify-center">
              ورود
            </span>
          </button>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              location.replace("/");
            }}
            className="flex items-baseline justify-center flex-col gap-1"
          >
            <Image src={LogoutIcon} alt="Logout" width={24} height={24} />
            <span className="text-[10px] text-black font-bold flex items-center justify-center">
              خروج
            </span>
          </button>
        </div>
      </Box>
      <MiddleSidebar />
    </>
  );
}
