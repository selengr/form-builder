"use client";

import {Box, TextField, Typography} from "@mui/material";
import AnimatedBox from "./AnimatedBox";
import ActionButtons from "./ActionButtons";
import {ILimitation} from "@/hooks/useParticipateForm";
import {Dispatch, SetStateAction} from "react";
import {useFormLimitation} from "@/hooks/useFormLimitation";

interface Props {
  type: "" | "phone" | "email";
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  setQuestion: Dispatch<any>;
  addQuestion: (data: any) => void;
}

export default function FormLimitation({
                                         type,
                                         setLimitation,
                                         setQuestion,
                                         addQuestion,
                                       }: Props) {
  const {
    formValue,
    error,
    helperText,
    loading,
    handleChange,
    handleSubmit,
    takePartApi,
    isValid,
  } = useFormLimitation(type, setLimitation, setQuestion, addQuestion);

  return (
    <>
      <AnimatedBox key="form-limitation">
        <Box display="flex" gap={1} flexDirection="column" width="100%" maxWidth="600px">
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography sx={{marginRight: "25px", fontWeight: "600"}}>
              {type === "phone" ? "شماره موبایل" : "ایمیل"}
            </Typography>
          </Box>

          <TextField
            placeholder={type === "phone" ? "09129876543" : "example@gmail.com"}
            type={type === "phone" ? "tel" : "text"}
            value={formValue}
            onChange={(e) => handleChange(e.target.value)}
            error={error}
            helperText={helperText}
            sx={{
              "& .MuiInputBase-root": {padding: 1.5},
              "& input": {padding: 0},
            }}
            fullWidth
            {...(type === "phone" && {
              inputProps: {
                maxLength: 11,
                pattern: "[0-9]*",
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              },
            })}
          />

          <Typography sx={{fontSize: "12px", fontWeight: "500"}} variant="subtitle2">
            لطفاً {type === "phone" ? "شماره موبایل" : "ایمیل"} خود را برای ادامه وارد کنید
          </Typography>
        </Box>
      </AnimatedBox>

      <ActionButtons
        disablePrev
        nextAction={!isValid ? handleSubmit : takePartApi}
        loadingNext={loading}
      />
    </>
  );
}
