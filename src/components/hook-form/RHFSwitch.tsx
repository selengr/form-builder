import { useFormContext, Controller } from "react-hook-form";
import {
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
} from "@mui/material";
import { SwitchButton } from "../Switch/SwitchButton";

interface Props extends Omit<FormControlLabelProps, "control"> {
  name: string;
  helperText?: React.ReactNode;
}

export default function RHFSwitch({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            control={<SwitchButton {...field} checked={field.value} />}
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
