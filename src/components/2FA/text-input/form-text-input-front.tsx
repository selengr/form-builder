'use client';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { InputBaseComponentProps } from '@mui/material/InputBase/InputBase';
import { Grid, Typography } from '@mui/material';
import { formatNumberWithCommas } from '@/lib/numberFormatter';

type TextInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  inputAdornment?: any;
  readOnly?: boolean;
  error?: string;
  testId?: string;
  autoComplete?: string;
  inputComponent?: React.ElementType<InputBaseComponentProps>;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  onChangeInput: (e: any, value: any) => void;
};

const TextInput = forwardRef<
  HTMLDivElement | null,
  TextInputProps & {
    name: string;
    value: string;
    onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, amount: string) => void;
    onBlur: () => void;
  }
>(function TextInput(props, ref) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [inputValueST, setInputValueST] = useState(props.value);

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const _HandleOnChange = (event: ChangeEvent<HTMLInputElement>): void | null => {
    let inputValue2 = '0';
    if (props.inputAdornment) {
      const checkSpacingRegex = /\s/g;
      if (checkSpacingRegex.test(event.target.value)) {
        return null;
      }

      let inputValue = event.target.value;
      inputValue = inputValue.replace(/[^0-9]/g, '');
      const formattedValue = formatNumberWithCommas(inputValue);
      setInputValueST(formattedValue);

      inputValue2 = formattedValue.replaceAll(',', '');
    } else {
      inputValue2 = event.target.value;
      setInputValueST(event.target.value);
    }
    props?.onChangeInput(event, inputValue2);
  };

  useEffect(() => {
    if (props.value !== '') {
      setInputValueST((props.value + '').replaceAll(',', ''));
    }
  }, [props.value]);

  return (
    <TextField
      ref={ref}
      name={props.name}
      // value={props.value}
      value={props.inputAdornment ? formatNumberWithCommas(inputValueST) : inputValueST}
      onChange={_HandleOnChange}
      onBlur={props.onBlur}
      label={''}
      autoFocus={props.autoFocus}
      type={props.type === 'password' && isShowPassword ? 'text' : 'props.type'}
      variant='outlined'
      placeholder={props.placeholder}
      fullWidth
      error={!!props.error}
      data-testid={props.testId}
      helperText={props.error}
      disabled={props.disabled}
      autoComplete={props.autoComplete}
      FormHelperTextProps={{
        ['data-testid' as string]: `${props.testId}-error`,
      }}
      multiline={props.multiline}
      minRows={props.minRows}
      maxRows={props.maxRows}
      sx={{ bgcolor: props.disabled ? '#eeeeee' : 'transparent' }}
      InputProps={{
        readOnly: props.readOnly,
        sx: {
          '& input': {
            height: '1.2rem',
            color: '#797979',
            border: 'none',
            backgroundColor: 'white',
            // borderColor: '#f1f1f1',
            borderRadius: '0 !important',
            paddingRight: '5px',
            textAlign: 'center',
            fontWeight: 'bold',
          },
          backgroundColor: '#2CDFC9',
          borderRadius: '0.99rem',
          paddingRight: 0,
        },
        inputComponent: props.inputComponent,
        endAdornment: props.inputAdornment ? (
          <InputAdornment
            position='end'
            sx={{
              backgroundColor: 'transparent',
              height: '100%',
              borderRight: ' 1px dashed #d9d9d9',
              paddingRight: '0.2rem',
              '& p': {
                minWidth: '40px',
                color: 'white',
              },
            }}>
            {props.inputAdornment}
          </InputAdornment>
        ) : undefined,
        // props.type === "password" ? (
        //   <InputAdornment position="end">
        //     <IconButton
        //       aria-label="toggle password visibility"
        //       onClick={handleClickShowPassword}
        //       onMouseDown={handleMouseDownPassword}
        //       edge="end"
        //     >
        //       {isShowPassword ? <VisibilityOff /> : <Visibility />}
        //     </IconButton>
        //   </InputAdornment>
        // ) : props.inputAdornment ?  <InputAdornment position="end">
        //     {props.inputAdornment}
        //   </InputAdornment> : undefined,
      }}
    />
  );
});

function FormTextInput<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> & TextInputProps,
) {
  return (
    <Controller
      // {...props.register}
      render={({ field, fieldState }) => (
        <Grid xs={12} item display='flex' alignItems='center' justifyContent={'space-between'}>
          <Typography sx={{ color: 'gray' }}>{props.label}</Typography>
          <Grid xs={8}>
            <TextInput
              label={''}
              autoFocus={props.autoFocus}
              type={props.type}
              placeholder={props.placeholder}
              error={fieldState.error?.message}
              disabled={props.disabled}
              readOnly={props.readOnly}
              testId={props.testId}
              multiline={props.multiline}
              minRows={props.minRows}
              maxRows={props.maxRows}
              inputComponent={props.inputComponent}
              inputAdornment={props.inputAdornment}
              onChangeInput={props.onChangeInput}
              {...field}
            />
          </Grid>
        </Grid>
      )}
      name={props.name}
      defaultValue={props.defaultValue}
    />
  );
}

export default FormTextInput;
