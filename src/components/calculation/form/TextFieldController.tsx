import React, { useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";

interface TextFieldControllerProps extends Omit<TextFieldProps, "name"> {
  name: string;
  type?: string;
}

export const TextFieldController: React.FC<TextFieldControllerProps> = ({
  name,
  type,
  ...props
}) => {
  const { control } = useFormContext();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          inputRef={inputRef}
          type={type}
          value={value || ""}
          onChange={onChange}
          error={!!error}
          helperText={error?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderColor: "none",
              "& fieldset": {
                paddingLeft: 2,
                borderRadius: "8px",
                border: "1px solid #DDE1E6",
              },
              "&:hover fieldset": {
                border: "1px solid #DDE1E6",
              },
              "&.Mui-focused fieldset": {
                border: "2px solid #DDE1E6",
              },
              "&.Mui-error fieldset": {
                borderColor: "#FA4D56",
              },
              height: {
                xs: 52,    
                // sm: 50,    
                // md: 52 
              },
            },
          }}
          {...props}
        />
      )}
    />
  );
};


