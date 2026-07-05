'use client';
import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

interface TextFieldControllerProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  type?: string;
  sx?: any;
}

export const TextFieldController: React.FC<TextFieldControllerProps> = ({
  name,
  type,
  sx,
  placeholder = 'مقدار',
  ...props
}) => {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: 'none',
              '& fieldset': {
                paddingLeft: 2,
                borderRadius: '12px',
                border: '1px solid #DDE1E6',
              },
              '&:hover fieldset': {
                border: '1px solid #DDE1E6',
              },
              '&.Mui-focused fieldset': {
                border: '2px solid #DDE1E6',
              },
              '&.Mui-error fieldset': {
                borderColor: '#FA4D56',
              },
              height: {
                xs: 50,
                // sm: 50,
                // md: 52
              },
            },
            ...sx,
          }}
          {...props}
        />
      )}
    />
  );
};
