import { Box, TextField, Typography } from "@mui/material";
import AnimatedBox from "./AnimatedBox";
import ActionButtons from "./ActionButtons";
import { Dispatch, SetStateAction, useState } from "react";
import AxiosApi from "@/services/axios/AxiosApi";
import { ILimitation } from "@/app/(participate)/form/page";

const validatePhone = (phone: string) => {
  const re = /^09\d{9}$/;
  return re.test(phone);
};

const validateEmail = (email: any) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export default function FormLimitation({
  type,
  setLimitation,
  setQuestion,
  addQuestion,
}: {
  type: string;
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  setQuestion: Dispatch<any>;
  addQuestion: (data: any) => void;
}) {
  const [formValue, setFormValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormValue(value);

    if (type === "phone") {
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
    } else {
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
    }
  };

  const handleSubmit = () => {
    setError(true);
    if (type === "phone") {
      setHelperText("شماره تلفن همراه الزامی می باشد");
    } else {
      setHelperText("ایمیل الزامی است");
    }
  };

  async function takePartApi() {
    try {
      setLoading(true);
      const response = await AxiosApi.post(
        "/take-part/check-answer-to-form-before",
        {
          formId: null,
          link: null,
          username: formValue,
        }
      );
      addQuestion(response);
      setQuestion(response.data);
      setLimitation({
        isLimited: false,
        limitationType: "",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatedBox key="form-limitation">
        <Box
          display="flex"
          gap={1}
          flexDirection="column"
          width="100%"
          maxWidth="600px"
        >
          {type === "phone" ? (
            <>
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
                value={formValue}
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
            </>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography sx={{ marginRight: "25px", fontWeight: "600" }}>
                  ایمیل
                </Typography>
              </Box>
              <TextField
                placeholder="example@gmail.com"
                type="text"
                value={formValue}
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
            </>
          )}
        </Box>
      </AnimatedBox>
      {type === "phone" ? (
        <ActionButtons
          disablePrev={true}
          nextAction={
            error || formValue.length !== 11 ? handleSubmit : takePartApi
          }
          loadingNext={loading}
        />
      ) : (
        <ActionButtons
          disablePrev={true}
          nextAction={error || !formValue.length ? handleSubmit : takePartApi}
          loadingNext={loading}
        />
      )}
    </>
  );
}
