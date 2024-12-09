import { ChangeEvent } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

type Props = TextFieldProps & {
  name: string;
  changeValueToDefault?: boolean;
  callBack?: (data: any) => any;
  getRHF?: (data: any) => any;
  uploader?: boolean;
};

export default function RHFTextField({
  name,
  helperText,
  changeValueToDefault = false,
  callBack = () => {},
  getRHF = () => {},
  uploader = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (
          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          if (other.type === "number") {
            callBack(Number(e?.target?.value));
            if (e.target.value === "") {
              field.onChange("");
            } else {
              const value = Number(e?.target?.value);
              field.onChange(value);
            }
          } else {
            const value = e.target.value;
            field.onChange(value);
          }
        };

        return (
          <TextField
            {...field}
            sx={{
              "& input": {
                padding: 1,
              },
              "& .MuiInputBase-input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
                MozAppearance: "none",
                appearance: "none",
              },
              "& .MuiInputBase-input::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
                MozAppearance: "none",
                appearance: "none",
              },
              "& .MuiFormHelperText-root": {
                marginX: "0 !important",
              },
            }}
            fullWidth
            onChange={handleChange}
            value={
              uploader
                ? getRHF(name)
                : typeof field.value === "number"
                ? changeValueToDefault === false
                  ? Number(field.value)
                  : Number(0.1)
                : field.value
            }
            error={!!error}
            helperText={error ? error?.message : helperText}
            {...other}
          />
        );
      }}
    />
  );
}
