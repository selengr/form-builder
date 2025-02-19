import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

export default function PublishSettingsTabValue() {
  const [value, setValue] = useState(0);

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
              // overflowX: "auto",
            },
          }}
        >
          <Tab disableRipple label="عمومی" />
          <Tab disableRipple disabled label="اعضای ام‌رسالت" />
          <Tab disableRipple disabled label="انفرادی" />
          {/* <Tab disableRipple disabled label="گروهی" /> */}
        </Tabs>
      </Box>
    </Box>
  );
}
