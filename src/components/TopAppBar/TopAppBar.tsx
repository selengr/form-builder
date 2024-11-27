import { FC, ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Box, SxProps, Theme, Skeleton, useTheme } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  imageUrl?: string;
  imageAlt?: string;
  customActions?: ReactNode;
  appBarSx?: SxProps<Theme>;
  toolbarSx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  imageSx?: SxProps<Theme>;
  userName?: string;
  userProfileImage?: string;
}

const TopAppBar: FC<HeaderProps> = ({
  customActions,
  appBarSx,
  toolbarSx,
  imageSx,
}) => {
  const { palette } = useTheme();
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton variant="circular" width={50} height={50} />
              <Box sx={{ ml: 2 }}>
                <Skeleton width={100} />
                <Skeleton width={80} />
              </Box>
            </Box>
          ) : false ? (
            <Link href={"/profile"}>
              <Box gap="5px" sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  width="50px"
                  height="50px"
                  bgcolor={palette.grey[400]}
                  borderRadius="50%"
                ></Box>
                <Box>
                  <Typography variant="body1" color="black">
                    {/* {userInfo?.user.fullName} */}
                  </Typography>
                  <Typography variant="caption" color="black">
                    مشاهده پروفایل
                  </Typography>
                </Box>
              </Box>
            </Link>
          ) : (
            <Box onClick={goToLoginPage}>
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
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
