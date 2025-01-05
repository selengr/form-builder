import { memo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { RHFMultiSelect } from "../hook-form";
import { SwitchButton } from "../Switch/SwitchButton";
import DatePicker from "../DatePicker/DatePicker";

const FieldCheckboxPair = memo(function FieldCheckboxPair({
  fieldName,
  label,
  type,
  options,
}: any) {
  const { setValue, getValues, control } = useFormContext();
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: any) => {
    const isChecked = event.target.checked;

    setValue(`${fieldName}.checked`, isChecked);
    setIsChecked((prev) => !prev);

    if (!isChecked) {
      if (type === "multi-select") {
        setValue(`${fieldName}.value`, []);
      } else {
        setValue(`${fieldName}.value`, "");
      }
    }
  };

  const renderInput = () => {
    const isChecked = getValues(`${fieldName}.checked`);

    switch (type) {
      case "select":
        return (
          <RHFMultiSelect
            disabled={!isChecked}
            sx={{
              "& .MuiInputBase-root": {
                height: "56px",
                borderRadius: "10px",
                fontWeight: "600",
              },
            }}
            name={`${fieldName}.value`}
            options={options}
          />
        );
      case "multi-select":
        return (
          <RHFMultiSelect
            disabled={!isChecked}
            sx={{
              "& .MuiInputBase-root": {
                height: "56px",
                borderRadius: "10px",
                fontWeight: "600",
              },
            }}
            multiple
            name={`${fieldName}.value`}
            options={options}
          />
        );
      case "date-picker":
        return (
          <Controller
            name={`${fieldName}.value`}
            control={control}
            render={({ field }) => (
              <DatePicker
                disabled={!isChecked}
                min={new Date().setDate(new Date().getDate())}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(`${fieldName}.value`, value);
                }}
              />
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="8px">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        gap="16px"
      >
        <Typography variant="subtitle2" fontWeight="600" fontSize="15px">
          {label}
        </Typography>
        <SwitchButton checked={isChecked} onChange={handleChange} />
      </Box>
      {renderInput()}
    </Box>
  );
});

export default FieldCheckboxPair;
