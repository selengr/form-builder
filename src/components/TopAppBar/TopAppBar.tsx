import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Typography} from "@mui/material";
import { useEffect, useState } from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import { toast } from "sonner";
import Avatar from '../Avatar/Avatar';

const TopAppBar = ({ customActions, appBarSx, toolbarSx, imageSx }: any) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await AxiosApi({
          url: "/authorization/front-panel/non-org-user-role/find-user-loggedin-info",
          baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        });

        setUserInfo(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const goToLoginPage = async () => {
    await signIn("authorize");
  };

  return (
    <AppBar
      elevation={0}
      position="static"
      sx={{
        pt: 2,
        height: "100px",
        color: "black",
        backgroundColor: "#fff",
        mb: 0,
        ...appBarSx,
      }}
    >
      <Toolbar sx={toolbarSx}>
        <Box sx={{ mr: 0, ...imageSx }}>
          {loading ? (
            <div className="flex items-center">
              <Skeleton variant="circular" width={50} height={50} />
              <div className="ml-4">
                <Skeleton width={100} />
                <Skeleton width={80} />
              </div>
            </div>
          ) : !!userInfo ? (
            <Link href="">
              <div className="gap-[5px] flex items-center">
                <Avatar size={"sm"} name={"userInfo?.user?.fullName"} />
                {/*<div className="w-[50px] h-[50px] bg-neutral-200 border-[1px] border-neutral-400 rounded-[50%]"></div>*/}
                <div>
                  <Typography variant="body1" color="black">
                    {userInfo?.user?.fullName}
                  </Typography>
                  <Typography variant="caption" color="black">
                    مشاهده پروفایل
                  </Typography>
                </div>
              </div>
            </Link>
          ) : (
            <div onClick={goToLoginPage}>
              <IconButton
                size="medium"
                disableRipple
                sx={{
                  "&.MuiButtonBase-root": {
                    display: "flex",
                    gap: "8px",
                  },
                }}
              >
                <Image
                  src="./images/home-page/login.svg"
                  alt="ورود"
                  width={24}
                  height={24}
                />
                {customActions ? (
                  customActions
                ) : (
                  <Typography color="#424242">ورود</Typography>
                )}
              </IconButton>
            </div>
          )}
        </Box>
        <div className="flex-grow" />
        <div className="flex items-center">
          <IconButton size="small" onClick={() => router.push("#")}>
            <Image
              src="./images/home-page/search.svg"
              alt="search"
              width={24}
              height={24}
            />
          </IconButton>
          <IconButton size="small">
            <Image
              src="./images/home-page/notification.svg"
              alt="notification"
              width={24}
              height={24}
            />
          </IconButton>
          {!loading && userInfo ? (
            <div
              onClick={async () => {
                await signOut({ redirect: false });
                toast.success("خروج با موفقیت انجام شد");
                location.replace("/");
              }}
            >
              <IconButton
                size="medium"
                disableRipple
                sx={{
                  "&.MuiButtonBase-root": {
                    display: "flex",
                    gap: "8px",
                  },
                }}
              >
                <Image
                  className="rotate-180"
                  src="./images/home-page/login.svg"
                  alt="خروج"
                  width={24}
                  height={24}
                />
              </IconButton>
            </div>
          ) : null}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
