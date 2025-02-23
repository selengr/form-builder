import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import GeneralSettings from "../GeneralSettings/GeneralSettings";

export type TabValues = "general" | "individual" | "group" | "mresalat";

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default function PublishSettingsTabValue({
  handleOpen,
}: {
  handleOpen: () => void;
}) {
  const [value, setValue] = useState<TabValues>("general");

  const handleChange = (event: React.SyntheticEvent, newValue: TabValues) => {
    setValue(newValue);
  };

  return (
    <>
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
          scrollButtons
          variant="scrollable"
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
          <Tab disableRipple label="عمومی" value="general" />
          <Tab disableRipple disabled label="انفرادی" value="individual" />
          <Tab disableRipple disabled label="گروهی" value="group" />
          <Tab disableRipple disabled label="اعضای ام‌رسالت" value="mresalat" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index="general">
        {value === "general" && <GeneralSettings handleOpen={handleOpen} />}
      </CustomTabPanel>
      <CustomTabPanel value={value} index="individual">
        {value === "individual" && <></>}
      </CustomTabPanel>
      <CustomTabPanel value={value} index="group">
        {value === "group" && <></>}
      </CustomTabPanel>
      <CustomTabPanel value={value} index="mresalat">
        {value === "mresalat" && <></>}
      </CustomTabPanel>
    </>
  );
}
