"use client"
import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useRouter, usePathname } from "next/navigation";

export default function DesignerTabs() {
  const [value, setValue] = useState(0);
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const builderId = pathname.split("/")[2] 
    switch (newValue) {
      case 2:
        router.push(`/builder/${builderId}`)
        break
      case 0:
        router.push(`/builder/${builderId}/condition`)
        break
      case 1:
        router.push(`/builder/${builderId}/calculator`)
        break
    }
  }


  useEffect(() => {
    if (pathname.includes("/condition")) {
      setValue(0)
    } else if (pathname.includes("/calculator")) {
      setValue(1)
    } else {
      setValue(2)
    }
  }, [pathname])


  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "4px",
        paddingX: "16px",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tabs
          TabIndicatorProps={{ style: { backgroundColor: "#2CDFC9" } }}
          value={value}
          onChange={handleChange}
          sx={{
            "&.MuiTabs-root": {
              width: "100%",
              paddingX: { md: "10px", lg: "40px" },
            },
            "& .MuiTabs-indicator": {
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
            "& .Mui-selected": {
              color: "#393939 !important",
              fontWeight: 700,
            },
            "& .MuiTabs-flexContainer": {
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            },
          }}
        >
          <Tab disableRipple label="شرط" />
          <Tab disableRipple label="محاسبه‌گر" />
          <Tab disableRipple label="پرسشنامه" />
        </Tabs>
      </Box>
    </Box>
  );
}
