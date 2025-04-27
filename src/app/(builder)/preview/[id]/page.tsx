"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";
import Loading from "./loading";
import usePreview from "@/hooks/usePreview";
import { useResponsive } from "@/hooks/useResponsive";
import PreviewProgress from "@/templates/preview/PreviewProgress";
import PreviewQuestion from "@/templates/preview/PreviewQuestion";
import {router} from "next/client";
import {IconButton} from "@mui/material";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import React from "react";

function PreviewPage() {
  const isMobile = useResponsive("down", "md");
  const { id: paramId } = useParams();
  const { status, title } = usePreview();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (status === "notExist") {
    return (
      <div className="flex justify-center h-[calc(100%-48px)] md:my-[20px] md:mx-[10px] m-[20px]">
        <div className="flex w-full h-full flex-col items-center justify-center gap-4">
          <h2 className="text-destructive text-3xl text-center font-semibold">
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
            onClick={()=>router.push(`/builder/${paramId}`)}
          >بازگشت به فرم ساز</Button>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <Box
        sx={{ userSelect: "none" }}
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
            <IconButton
              onClick={()=>router.back()
              }
            >
              <MdOutlineKeyboardArrowRight color="#292D32"/>
            </IconButton>
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
}

export default PreviewPage;
