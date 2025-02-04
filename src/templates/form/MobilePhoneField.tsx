import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import ActionButtons from "./ActionButtons";
import AnimatedBox from "./AnimatedBox";

export default function MobilePhoneField({
  nextAction,
}: {
  nextAction: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const validatePhone = (phone: string) => {
    const re = /^09\d{9}$/;
    return re.test(phone);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhone(value);

    if (!validatePhone(value)) {
      if (value.length === 0) {
        setError(true);
        setHelperText("شماره موبایل الزامی است");
      } else if (value.length < 11) {
        setError(true);
        setHelperText("شماره موبایل باید 11 رقم باشد");
      } else {
        setError(true);
        setHelperText("شماره موبایل باید با '09' شروع شود");
      }
    } else {
      setError(false);
      setHelperText("");
    }
  };

  const handleSubmit = () => {
    setError(true);
    setHelperText("شماره تلفن همراه الزامی می باشد");
  };

  return (
    <>
      <AnimatedBox key="phone">
        <Box
          display="flex"
          gap={1}
          flexDirection="column"
          width="100%"
          maxWidth="600px"
        >
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography sx={{ marginRight: "25px", fontWeight: "600" }}>
              شماره موبایل
            </Typography>
          </Box>
          <TextField
            placeholder="09129876543"
            type="tel"
            slotProps={{
              htmlInput: {
                maxLength: 11,
                pattern: "[0-9]*",
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              },
            }}
            value={phone}
            onChange={handleChange}
            error={error}
            helperText={helperText}
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            fullWidth
          />
          <Typography
            sx={{ fontSize: "12px", fontWeight: "500" }}
            variant="subtitle2"
          >
            لطفا شماره موبایل خود را برای ادامه دادن وارد کنید
          </Typography>
        </Box>
      </AnimatedBox>
      <ActionButtons
        disablePrev={true}
        nextAction={error || phone.length !== 11 ? handleSubmit : nextAction}
        prevAction={() => {}}
      />
    </>
  );
}
