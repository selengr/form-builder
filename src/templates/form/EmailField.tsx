import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import ActionButtons from "./ActionButtons";
import AnimatedBox from "./AnimatedBox";

export default function EmailField({ nextAction }: { nextAction: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const validateEmail = (email: any) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setEmail(value);

    if (value.length === 0) {
      setError(true);
      setHelperText("شماره موبایل الزامی است");
    } else if (!validateEmail(value)) {
      setError(true);
      setHelperText("فرمت ایمیل صحیح نمی باشد");
    } else {
      setError(false);
      setHelperText("");
    }
  };

  const handleSubmit = () => {
    setError(true);
    setHelperText("ایمیل الزامی است");
  };

  return (
    <>
      <AnimatedBox key="email">
        <Box
          display="flex"
          gap={1}
          flexDirection="column"
          width="100%"
          maxWidth="600px"
        >
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography sx={{ marginRight: "25px", fontWeight: "600" }}>
              ایمیل
            </Typography>
          </Box>
          <TextField
            type="text"
            placeholder="example@gmail.com"
            value={email}
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
            لطفا ایمیل خود را برای ادامه دادن وارد کنید
          </Typography>
        </Box>
      </AnimatedBox>
      <ActionButtons
        disablePrev={true}
        nextAction={error || !email.length ? handleSubmit : nextAction}
        prevAction={() => {}}
      />
    </>
  );
}
