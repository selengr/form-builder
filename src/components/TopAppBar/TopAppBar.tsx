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
  const {userInfo, loading} = useUserInfo();
  const endPoint = process.env.NEXT_PUBLIC_MRESALAT_ENDPOINT || "";

  const handleAuth = async () => {
    if (userInfo) {
      await signOut({callbackUrl: "/"});
      toast.success("خروج با موفقیت انجام شد");
    } else {
      await signIn("authorize");
    }
  };

  const renderUser = () => {
    if (loading) {
      return (<div className="flex items-center gap-4">
          <Skeleton variant="circular" width={50} height={50}/>
          <div>
            <Skeleton width={100}/>
            <Skeleton width={80}/>
          </div>
        </div>);
    }

    if (userInfo) {
      return (<Link href={`${endPoint}/profile`}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar size="sm" name={userInfo?.user?.fullName || "کاربر"}/>
            <div>
              <Typography variant="body1">{userInfo.user.fullName}</Typography>
              <Typography variant="caption">مشاهده پروفایل</Typography>
            </div>
          </div>
        </Link>);
    }

    return (<IconButton onClick={handleAuth} sx={{gap: 1}}>
        <Image src="/images/home-page/login.svg" alt="ورود" width={24} height={24}/>
        {customActions ?? <Typography color="#424242">ورود</Typography>}
      </IconButton>);
  };

  return (<AppBar
      elevation={0}
      position="static"
      sx={{pt: 2, height: "100px", bgcolor: "#fff", color: "black", ...appBarSx}}
    >
      <Toolbar sx={toolbarSx}>
        <Box sx={{...imageSx}}>{renderUser()}</Box>
        <Box sx={{flexGrow: 1}}/>

        <Box className="flex items-center gap-2">
          <IconButton size="small" onClick={() => router.push("#")}>
            <Image src="/images/home-page/search.svg" alt="search" width={24} height={24}/>
          </IconButton>

          <IconButton size="small">
            <Image src="/images/home-page/notification.svg" alt="notification" width={24} height={24}/>
          </IconButton>

          {!loading && userInfo && (<IconButton onClick={handleAuth}>
              <Image
                className="rotate-180"
                src="/images/home-page/login.svg"
                alt="خروج"
                width={24}
                height={24}
              />
            </IconButton>)}
        </Box>
      </Toolbar>
    </AppBar>);
};

export default TopAppBar;
