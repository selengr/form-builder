"use client";

import {AppBar, Box, IconButton, Skeleton, Toolbar, Typography,} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {signIn, signOut} from "next-auth/react";
import {toast} from "sonner";

import Avatar from "../Avatar/Avatar";
import {useUserInfo} from "@/hooks/useUserInfo";

const TopAppBar = ({customActions, appBarSx, toolbarSx, imageSx}: any) => {
  const router = useRouter();
  const {userInfo, loading, error} = useUserInfo();

  const handleLogin = async () => {
    await signIn("authorize");
  };

  const handleLogout = async () => {
    toast.success("خروج با موفقیت انجام شد");
    await signOut({callbackUrl: "/"});
  };

  const renderUserSection = () => {
    if (loading) {
      return (<div className="flex items-center">
          <Skeleton variant="circular" width={50} height={50}/>
          <div className="ml-4">
            <Skeleton width={100}/>
            <Skeleton width={80}/>
          </div>
        </div>);
    }

    if (userInfo) {
      return (<Link href="">
          <div className="gap-[5px] flex items-center">
            <Avatar size="sm" name={userInfo?.user?.fullName || "کاربر"}/>
            <div>
              <Typography variant="body1" color="black">
                {userInfo?.user?.fullName}
              </Typography>
              <Typography variant="caption" color="black">
                مشاهده پروفایل
              </Typography>
            </div>
          </div>
        </Link>);
    }

    return (<div onClick={handleLogin}>
        <IconButton
          size="medium"
          disableRipple
          sx={{display: "flex", gap: "8px"}}
        >
          <Image
            src="/images/home-page/login.svg"
            alt="ورود"
            width={24}
            height={24}
          />
          {customActions ?? <Typography color="#424242">ورود</Typography>}
        </IconButton>
      </div>);
  };

  return (<AppBar
      elevation={0}
      position="static"
      sx={{
        pt: 2, height: "100px", color: "black", backgroundColor: "#fff", ...appBarSx,
      }}
    >
      <Toolbar sx={toolbarSx}>
        <Box sx={{mr: 0, ...imageSx}}>{renderUserSection()}</Box>

        <div className="flex-grow"/>

        <div className="flex items-center">
          <IconButton size="small" onClick={() => router.push("#")}>
            <Image
              src="/images/home-page/search.svg"
              alt="search"
              width={24}
              height={24}
            />
          </IconButton>

          <IconButton size="small">
            <Image
              src="/images/home-page/notification.svg"
              alt="notification"
              width={24}
              height={24}
            />
          </IconButton>

          {!loading && userInfo && (<div onClick={handleLogout}>
              <IconButton size="medium" disableRipple sx={{gap: "8px"}}>
                <Image
                  className="rotate-180"
                  src="/images/home-page/login.svg"
                  alt="خروج"
                  width={24}
                  height={24}
                />
              </IconButton>
            </div>)}
        </div>
      </Toolbar>
    </AppBar>);
};

export default TopAppBar;
