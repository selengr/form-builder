import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function DesignerTabs() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Tabs
        value="QUESTION"
        sx={{
          direction: "ltr",
          border: "1px solid #d3d3d3",
          borderRadius: "10px",
          padding: "5px",
          "& .MuiButtonBase-root": {
            zIndex: 10,
          },
          "& .Mui-selected": {
            color: "white !important",
          },
          "& .MuiTabs-indicator": {
            zIndex: 0,
            height: "48px",
            borderRadius: "10px",
          },
        }}
      >
        <Tab
          sx={{
            "&.MuiButtonBase-root.MuiTab-root": {
              minWidth: "35px",
            },
          }}
          disableRipple
          value="QUESTION"
          label="پرسشنامه"
        />
        <Tab
          sx={{
            "&.MuiButtonBase-root.MuiTab-root": {
              minWidth: "35px",
            },
          }}
          disabled
          disableRipple
          value="CALCULATOR"
          label="محاسبه‌گر"
        />
        <Tab
          sx={{
            "&.MuiButtonBase-root.MuiTab-root": {
              minWidth: "35px",
            },
          }}
          disabled
          disableRipple
          value="CONDITIONS"
          label="شروط"
        />
      </Tabs>
    </Box>
  );
}
