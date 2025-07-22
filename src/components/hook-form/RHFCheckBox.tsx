import {Controller, useFormContext} from "react-hook-form";
import {Checkbox, FormControlLabel, FormControlLabelProps, FormHelperText,} from "@mui/material";

interface Props extends Omit<FormControlLabelProps, "control"> {
  name: string;
  helperText?: React.ReactNode;
}

export default function RHFCheckBox({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex items-center">
          <FormControlLabel
            sx={{
              "&.MuiFormControlLabel-root": {
                marginX: 0,
              },
            }}
            control={
              <Checkbox
                sx={{
                  "& .MuiSvgIcon-root": {
                    color: "#1758BA",
                    bgcolor: "white",
                  },
                }}
                {...field}
                checked={field.value}
              />
            }
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
