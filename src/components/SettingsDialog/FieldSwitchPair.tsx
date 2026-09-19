'use client';

import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { RHFMultiSelect } from '../hook-form';
import { SwitchButton } from '../Switch/SwitchButton';
import { DatePicker as DatePickerCustome } from '../DatePicker/DatePicker';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/analog_time_picker';
import { GoClock } from 'react-icons/go';
import TimePickerStyled from './TimePicker.styled';

const FieldSwitchPair = memo(function FieldSwitchPair({
  fieldName,
  label,
  type,
  options,
  disabled = false,
}: any) {
  const { setValue, control, watch } = useFormContext();
  const isChecked = watch(`${fieldName}.checked`);

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <RHFMultiSelect
            sx={{
              '& .MuiInputBase-root': {
                height: '56px',
                borderRadius: '10px',
                fontWeight: '600',
              },
            }}
            name={`${fieldName}.value`}
            options={options}
          />
        );
      case 'multi-select':
        return (
          <RHFMultiSelect
            sx={{
              '& .MuiInputBase-root': {
                height: '56px',
                borderRadius: '10px',
                fontWeight: '600',
              },
            }}
            multiple
            name={`${fieldName}.value`}
            options={options}
          />
        );
      case 'date-picker':
        return (
          <Controller
            name={`${fieldName}.value`}
            control={control}
            render={({ field }) => (
              <DatePickerCustome
                min={new Date().setDate(new Date().getDate() - 1)}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(`${fieldName}.value`, value, { shouldDirty: true });
                }}
              />
            )}
          />
        );
      case 'time-picker':
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
                  textAlign="center">
                  <DatePicker
                    disableDayPicker
                    format="HH:mm:ss"
                    inputClass="w-full text-center font-bold"
                    containerClassName="w-full"
                    plugins={[<TimePicker key="1" />]}
                    onChange={(value: any) => {
                      const formattedValue = `${value.hour}:${value.minute}:${value.second}`;
                      field.onChange(value);
                      setValue(`${fieldName}.value`, formattedValue, { shouldDirty: true });
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

  if (type === 'switch') {
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <Box display="flex" justifyContent="space-between" width="100%" gap="16px">
              <Typography variant="subtitle2" fontWeight="600" fontSize="15px">
                {label}
              </Typography>
              <SwitchButton
                disableRipple
                disabled={disabled}
                checked={!!field.value}
                onChange={(event) => {
                  if (disabled) return;
                  field.onChange(event.target.checked);
                }}
              />
            </Box>
          </div>
        )}
      />
    );
  }

  // Switch + optional input (e.g. responseLimitation)
  return (
    <div className="flex flex-col gap-2">
      <Box display="flex" justifyContent="space-between" width="100%" gap="16px">
        <Typography variant="subtitle2" fontWeight="600" fontSize="15px">
          {!disabled ? label : `${label} (بزودی)`}
        </Typography>
        <Controller
          name={`${fieldName}.checked`}
          control={control}
          render={({ field }) => (
            <SwitchButton
              disableRipple
              disabled={disabled}
              checked={!!field.value}
              onChange={(event) => {
                if (disabled) return;
                const checked = event.target.checked;
                field.onChange(checked);
                if (!checked) {
                  setValue(
                    `${fieldName}.value`,
                    type === 'multi-select' ? [] : '',
                    { shouldDirty: true, shouldValidate: true },
                  );
                }
              }}
            />
          )}
        />
      </Box>
      {isChecked && renderInput()}
    </div>
  );
});

export default FieldSwitchPair;
