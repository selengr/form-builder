"use client"

import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useRouter, usePathname } from "next/navigation";

export default function DesignerTabs() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const builderIndex = segments.indexOf("builder");
  const builderId = builderIndex !== -1 ? segments[builderIndex + 1] : "";

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    if (!builderId) return;

    const tabRoutes = [
      `/builder/${builderId}/condition`,
      `/builder/${builderId}/calculator`,
      `/builder/${builderId}`,
    ];

    router.push(tabRoutes[newValue]);
  };

  useEffect(() => {
    const lastSegment = segments.at(-1);

    switch (lastSegment) {
      case "condition":
        setValue(0);
        break;
      case "calculator":
        setValue(1);
        break;
      case "builder":
      default:
        setValue(2);
        break;
    }
  }, [pathname]);

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "4px",
        px: "16px",
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
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "#2CDFC9" } }}
          sx={{
            "&.MuiTabs-root": {
              width: "100%",
              px: { md: "10px", lg: "40px" },
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
