import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function DesignerTabs() {
  const [value, setValue] = useState(2);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          <Tab disabled disableRipple label="شرط" />
          <Tab disabled disableRipple label="محاسبه‌گر" />
          <Tab disableRipple label="پرسشنامه" defaultChecked />
        </Tabs>
      </Box>
    </Box>
  );
}
