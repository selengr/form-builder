import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TopAppBar = ({ customActions, appBarSx, toolbarSx, imageSx }: any) => {
  const router = useRouter();
  //   const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  //   const [loading, setLoading] = useState<boolean>(true);

  //   useEffect(() => {
  //     const fetchUserInfo = async () => {
  //       try {
  //         const data = await getUserInfo();
  //         setUserInfo(data);
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchUserInfo();
  //   }, []);

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
        backgroundColor: "#F7F7FF",
        mb: 0,
        ...appBarSx,
      }}
    >
      <Toolbar sx={toolbarSx}>
        <Box sx={{ mr: 0, ...imageSx }}>
          {true ? (
            <div className="flex items-center">
              <Skeleton variant="circular" width={50} height={50} />
              <div className="ml-4">
                <Skeleton width={100} />
                <Skeleton width={80} />
              </div>
            </div>
          ) : false ? (
            <Link href={"/profile"}>
              <div className="gap-[5px] flex items-center">
                <div className="w-[50px] h-[50px] bg-neutral-400 rounded-[50%]"></div>
                <div>
                  {/* <Typography variant="body1" color="black">
                    {userInfo?.user.fullName}
                  </Typography> */}
                  <p className="text-black">مشاهده پروفایل</p>
                </div>
              </div>
            </Link>
          ) : (
            <div onClick={goToLoginPage}>
              <IconButton size="small">
                <Image
                  src="/icons/login.svg"
                  alt="ورود"
                  style={{ width: 24, height: 24 }}
                />
              </IconButton>
              {customActions ? (
                customActions
              ) : (
                <Button color="inherit">ورود</Button>
              )}
            </div>
          )}
        </Box>
        <div className="flex-grow" />
        <div className="flex items-center">
          <IconButton
            size="small"
            onClick={() => router.push("/mresalat-search")}
          >
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
