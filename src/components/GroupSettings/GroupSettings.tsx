import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { LuUserRoundSearch } from "react-icons/lu";
import { TfiDownload } from "react-icons/tfi";
import { SwitchButton } from "../Switch/SwitchButton";
import { LoadingButton } from "@mui/lab";

const rows = [
  { title: "گروه پیش فرض", users: 35, date: "1403/02/23" },
  { title: "گروه پیش فرض", users: 35, date: "1403/02/23" },
  { title: "گروه پیش فرض", users: 35, date: "1403/02/23" },
];

function GroupSettings({ handleOpen }: { handleOpen: () => void }) {
  return (
    <Box>
      <Box
        bgcolor="#f7f7f7"
        mt={2}
        padding={2}
        display="flex"
        flexDirection="column"
      >
        <Paper
          sx={{
            boxShadow: "unset",
            border: "1px solid #C9C9C9 ",
            display: "flex",
            alignItems: "center",
            width: "100%",
            paddingY: 1,
            "&.MuiPaper-root": {
              borderRadius: "18px",
              margin: "0 0 20px 0",
            },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, textAlign: "end" }}
            placeholder="کاوش بر اساس نام پایگاه داده"
            inputProps={{ "aria-label": "کاوش بر اساس نام پایگاه داده" }}
          />
          <IconButton type="button" sx={{ p: "8px" }} aria-label="search">
            <Image
              src="./images/home-page/search.svg"
              width={23}
              height={23}
              alt="Add"
              style={{
                cursor: "pointer",
              }}
            />
          </IconButton>
        </Paper>
        <Box display="flex" alignItems="center" gap={1}>
          <Checkbox />
          <Typography>انتخاب همه</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          {rows.map((row, index) => (
            <Box
              key={index}
              display="flex"
              gap={1}
              bgcolor="white"
              alignItems="center"
              width="100%"
              justifyContent="space-between"
              padding={1}
              borderRadius="12px"
            >
              <Checkbox />
              <Typography>{row.title}</Typography>
              <Box />
              <Typography>عضو: {row.users} نفر</Typography>
              <Typography>{row.date}</Typography>
              <Box display="flex" gap={0.5}>
                <IconButton>
                  <LuUserRoundSearch size="1.5rem" color="black" />
                </IconButton>
                <IconButton>
                  <TfiDownload size="1.5rem" color="#1758BA" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Typography fontSize="10px" mt={0.75}>
        ظرفیت باقی‌مانده 30 نفر.
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography
          variant="subtitle2"
          fontWeight="500"
          color="#393939"
          fontSize="14px"
        >
          نمایش نتیجه به پاسخ دهنده
        </Typography>
        <SwitchButton />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          paddingX: "16px",
          width: "100%",
          marginTop: "24px",
        }}
      >
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          sx={{
            bgcolor: "#1758BA",
            height: "54px",
            color: "white",
            fontSize: {
              xs: "13px",
              sm: "16px",
            },
            fontWeight: "700",
            borderRadius: "10px",
            boxShadow: "none",
            "&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active": {
              bgcolor: "#1758BA",
              boxShadow: "none",
            },
          }}
        >
          افزودن به سبد خرید
        </LoadingButton>
        <Button
          type="button"
          fullWidth
          className="text-[16px] text-[#1758BA]"
          sx={{
            height: "54px",
            fontWeight: "700",
            borderRadius: "10px",
            fontSize: "16px",
            color: "#1758BA",
            borderColor: "#1758BA",
            bgcolor: "white",
            "&.MuiButtonBase-root:hover": {
              bgcolor: "transparent",
              boxShadow: "none",
              color: "#1758BA",
            },
          }}
          variant="outlined"
          onClick={() => {
            handleOpen();
          }}
        >
          انصراف
        </Button>
      </Box>
    </Box>
  );
}

export default GroupSettings;
