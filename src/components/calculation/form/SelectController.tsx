import type React from "react";
import {
  Box,
  Chip,
  Select,
  Checkbox,
  MenuItem,
  InputLabel,
  OutlinedInput,
  FormControl,
  type Theme,
  type SxProps,
  type SelectProps,
  FormHelperText,
  LinearProgress,
} from "@mui/material";

import { IoIosArrowDown } from "react-icons/io";
import { useFormContext, Controller } from "react-hook-form";

interface CustomSelectProps extends Omit<SelectProps, "sx" | "name"> {
  options: { value: string; label: string }[];
  sx?: SxProps<Theme>;
  name: string;
  onChange?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SelectController: React.FC<CustomSelectProps> = ({
  options,
  sx,
  name,
  onChange,
  disabled = false,
  isLoading = false,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <Select
            IconComponent={IoIosArrowDown}
            variant="outlined"
            {...field}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            disabled={disabled || isLoading}
            displayEmpty
            renderValue={(selected) => {
              if (isLoading) {
                return (
                  <LinearProgress
                    variant="buffer"
                    value={0}
                    valueBuffer={0}
                    sx={{ width: 28, pt: 1 }}
                  />
                );
              }
              const selectedOption = options?.find(
                (option) => option.value === selected
              );
              return selectedOption ? selectedOption.label : "";
            }}
            sx={{
              "& .MuiSelect-select.MuiSelect-outlined": {
                fontFamily: "inherit",
                paddingRight: "33px",
                paddingLeft: "0 !important",
              },
              "&.MuiInputBase-root": {
                borderRadius: "8px",
                paddingLeft: 2,
                border: error ? "1px solid #FA4D56" : "1px solid #DDE1E6",
                height: {
                  xs: 52,    
                  // sm: 50,    
                  // md: 52 
                },
              },
              "& .MuiSelect-icon": {
                left: "auto",
                right: "16px",
                color: error ? "#FA4D56" : "#1758BA",
                fontSize: "1.5rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              ...(sx as SxProps<Theme>),
            }}
            {...props}
          >
            {options?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  py: 1,
                  px: 2,
                  mx: 1,
                  borderRadius: 0.75,
                  typography: "body2",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <FormHelperText sx={{ color: "#FA4D56" }}>
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

// ----------------------------------------------------------------------

type RHFMultiSelectProps = SelectProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  options: {
    label: string;
    value: string;
  }[];
};

export function MultiSelectController({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  sx,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const renderValues = (selectedIds: string[]) => {
    const selectedItems = options.filter((item) =>
      selectedIds.includes(item.value)
    );

    if (!selectedItems.length && placeholder) {
      return (
        <Box component="em" sx={{ color: "text.disabled" }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(", ");
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={sx}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            labelId={name}
            IconComponent={IoIosArrowDown}
            input={<OutlinedInput fullWidth label={label} error={!!error} />}
            renderValue={renderValues}
            MenuProps={{
              PaperProps: {
                sx: { px: 1, maxHeight: 280 },
              },
            }}
            sx={{
              "& .MuiSelect-select.MuiSelect-outlined": {
                fontFamily: "inherit",
                paddingRight: "33px",
                paddingLeft: "0 !important",
                minWidth: 150,
              },
              "&.MuiInputBase-root": {
                borderRadius: "8px",
                paddingLeft: 2,
                border: error ? "1px solid #FA4D56" : "1px solid #DDE1E6",
                height: {
                  xs: 52,    
                  // sm: 50,    
                  // md: 52 
                }
              },
              "& .MuiSelect-icon": {
                left: "auto",
                right: "16px",
                color: error ? "#FA4D56" : "#1758BA",
                fontSize: "1.5rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            {...other}
            value={field.value || []}
          >
            {placeholder && (
              <MenuItem
                disabled
                value=""
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 0.75,
                  typography: "body2",
                }}
              >
                <em> {placeholder} </em>
              </MenuItem>
            )}

            {options?.map((option) => {
              const selected = field.value?.includes(option.value);

              return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 0.75,
                    typography: "body2",
                    ...(selected && {
                      fontWeight: "fontWeightMedium",
                    }),
                    ...(checkbox && {
                      p: 0.25,
                    }),
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  {checkbox && (
                    <Checkbox disableRipple size="small" checked={selected} />
                  )}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
