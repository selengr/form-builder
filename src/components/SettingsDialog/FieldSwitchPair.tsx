"use client";

import { memo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { RHFMultiSelect } from "../hook-form";
import { SwitchButton } from "../Switch/SwitchButton";
import { DatePicker as DatePickerCustome } from "../DatePicker/DatePicker";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/analog_time_picker";
import { GoClock } from "react-icons/go";
import TimePickerStyled from "./TimePicker.styled";

const FieldSwitchPair = memo(function FieldCheckboxPair({
  fieldName,
  label,
  type,
  options,
  disabled = false,
}: any) {
  const { setValue, control } = useFormContext();
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: any) => {
    if (disabled) return;

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
    switch (type) {
      case "select":
        return (
          <RHFMultiSelect
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
              <DatePickerCustome
                min={new Date().setDate(new Date().getDate() - 1)}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(`${fieldName}.value`, value);
                }}
              />
            )}
          />
        );
      case "time-picker":
        return (
          <Controller
            name={`${fieldName}.value`}
            control={control}
            render={({ field }) => (
              <TimePickerStyled>
                <Box
                  display="flex"
                  alignItems="center"
                  height="56px"
                  borderRadius="10px"
                  border="1px solid #d4d4d4"
                  textAlign="center"
                >
                  <DatePicker
                    disableDayPicker
                    format="HH:mm"
                    inputClass="w-full text-center font-bold"
                    containerClassName="w-full"
                    plugins={[<TimePicker key="1" hideSeconds />]}
                    onChange={(value: any) => {
                      const formattedValue = `${value.hour}:${value.minute}`;
                      field.onChange(value);
                      setValue(`${fieldName}.value`, formattedValue);
                    }}
                  />
                  <GoClock size="2rem" className="ml-2" color="#424242" />
                </Box>
              </TimePickerStyled>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        gap="16px"
      >
        <Typography variant="subtitle2" fontWeight="600" fontSize="15px">
          {!disabled ? label : `${label} (بزودی)`}
        </Typography>
        <SwitchButton
          disableRipple
          checked={isChecked}
          onChange={handleChange}
        />
      </Box>
      {isChecked && renderInput()}
    </div>
  );
});

export default FieldSwitchPair;
