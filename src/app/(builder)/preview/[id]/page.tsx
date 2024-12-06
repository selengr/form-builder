"use client";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useParams } from "next/navigation";
import Loading from "./loading";
import { IoIosArrowForward } from "react-icons/io";
import usePreview from "@/hooks/usePreview";
import { useResponsive } from "@/hooks/useResponsive";
import PreviewProgress from "@/templates/preview/PreviewProgress";
import PreviewQuestion from "@/templates/preview/PreviewQuestion";

function PreviewPage() {
  const isMobile = useResponsive("down", "md");
  const { id: paramId } = useParams();
  const { status, title } = usePreview();

  if (status === "ready") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        margin={isMobile ? "20px 10px" : 2.5}
      >
        <Box
          maxWidth="1200px"
          width="100%"
          sx={{ direction: "ltr" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          padding={2}
          borderRadius="10px"
          paddingBottom="2rem"
          dir="rtl"
          bgcolor="white"
          border="1px solid #f7f7f7"
          boxShadow="0px 0px 15px -5px #c1c1c1"
        >
          <Box
            marginBottom={4}
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            sx={{
              backgroundColor: "#F7F7FF",
              padding: "10px",
            }}
            borderRadius="10px"
          >
            <Link href={`/builder/${paramId}`}>
              <Button
                disableRipple
                sx={{
                  "&.MuiButtonBase-root": {
                    borderRadius: "10px",
                    border: "1px solid #1758BA",
                    paddingX: "5px",
                    width: "30px",
                  },
                }}
              >
                <IoIosArrowForward fontSize="1.5rem" color="#000" />
              </Button>
            </Link>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography
                variant="subtitle1"
                component={"h3"}
                fontWeight={600}
                fontSize="20px"
                color="#424242"
              >
                {title}
              </Typography>
            </Box>
            <Box></Box>
          </Box>
          <PreviewQuestion />
          <PreviewProgress />
        </Box>
      </Box>
    );
  }

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        margin={isMobile ? "20px 10px" : 2.5}
        height="calc(100% - 48px)"
      >
        <Loading />
      </Box>
    );
  }

  if (status === "notExist") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        margin={isMobile ? "20px 10px" : 2.5}
        height="calc(100% - 48px)"
      >
        <div className="flex w-full h-full flex-col items-center justify-center gap-4">
          <h2 className="text-destructive text-3xl text-center">
            هنوز سوالی ساخته نشده است
          </h2>
          <Button
            variant="contained"
            sx={{
              color: "#fff",
              background: "#111",
              "&.MuiButtonBase-root:hover": {
                bgcolor: "#222",
              },
            }}
          >
            <Link href={`/builder/${paramId}`}>بازگشت به فرم ساز</Link>
          </Button>
        </div>
      </Box>
    );
  }
}

export default PreviewPage;
