'use client';
import type React from 'react';
import { useState } from 'react';
import { Box, Button, Checkbox, Chip, FormControl, FormHelperText, InputLabel, LinearProgress, ListSubheader, MenuItem, OutlinedInput, Select, type SelectProps, type SxProps, type Theme } from '@mui/material';

import { IoIosArrowDown } from 'react-icons/io';
import { Controller, useFormContext } from 'react-hook-form';

interface CustomSelectProps extends Omit<SelectProps, 'sx' | 'name'> {
  options: { value: string; label: string; highlighted?: boolean }[];
  sx?: SxProps<Theme>;
  name: string;
  onChange?: any;
  disabled?: boolean;
  isOperator?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  parentStyle?: SxProps<Theme>;
  contentInset?: string;
  iconInset?: string;
  borderless?: boolean;
  emptyText?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
}

const MENU_CLOSE_DELAY = 300;

export const SelectController: React.FC<CustomSelectProps> = ({
  options,
  sx,
  name,
  onChange,
  disabled = false,
  isOperator = false,
  isLoading = false,
  placeholder = '',
  parentStyle,
  contentInset = '12px',
  iconInset = '18.8px',
  borderless = false,
  emptyText,
  emptyActionText,
  onEmptyAction,
  ...props
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const showEmpty = Boolean(emptyText) && !isLoading && !options?.length;

  const handleEmptyAction = () => {
    setOpen(false);
    setTimeout(() => onEmptyAction?.(), MENU_CLOSE_DELAY);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} sx={{ ...parentStyle }}>
          <Select
            IconComponent={IoIosArrowDown}
            variant='outlined'
            {...field}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            disabled={disabled || isLoading}
            displayEmpty
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderValue={(selected) => {
              if (isLoading) {
                return <LinearProgress variant='buffer' value={0} valueBuffer={0} sx={{ width: 28, pt: 1 }} />;
              }
              if (!selected || selected === '') {
                return (
                  <Box component="span" sx={{ color: '#9EA3AC', fontSize: '14px' }}>
                    {placeholder}
                  </Box>
                );
              }
              const selectedText = String(selected);
              const selectedOption = options?.find((option) =>
                isOperator ? option.value === selectedText.split('@')[0] : option.value === selectedText,
              );
              return selectedOption ? selectedOption.label : '';
            }}
            sx={{
              '& .MuiSelect-select.MuiSelect-outlined': {
                fontFamily: 'inherit',
                paddingRight: '33px',
                paddingLeft: '0 !important',
              },
              '&.MuiInputBase-root': {
                borderRadius: borderless ? '8px' : '12px',
                paddingLeft: contentInset,
                border: borderless ? 'none' : error ? '1px solid #FA4D56' : '1px solid #DDE1E6',
                height: {
                  xs: 52,
                  sm: 50,
                  md: 52
                },
              },
              '& .MuiSelect-icon': {
                left: 'auto',
                right: iconInset,
                color: error ? '#FA4D56' : '#1758BA',
                fontSize: '1.2rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              ...(sx as SxProps<Theme>),
            }}
            {...props}>
            {options?.map((option) => (
              <MenuItem
                key={option.value}
                value={!isOperator ? option.value : option.value + '@' + option.label}
                sx={{
                  display: 'flex',
                  py: 1,
                  px: 2,
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  ...(option.highlighted && {
                    mb: 0.5,
                    color: '#1758BA',
                    backgroundColor: '#F1F6FD',
                    '&:hover, &.Mui-selected, &.Mui-selected:hover': { backgroundColor: '#E6EEFB' },
                  }),
                }}>
                {option.label}
              </MenuItem>
            ))}
            {showEmpty && (
              <ListSubheader disableSticky sx={{ px: 2, py: 1.5, lineHeight: 1.6, backgroundColor: 'transparent' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
                  <Box component="span" sx={{ fontSize: 13, color: '#6F7782', fontWeight: 400 }}>
                    {emptyText}
                  </Box>
                  {onEmptyAction && emptyActionText && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleEmptyAction}
                      sx={{
                        fontSize: 12,
                        borderRadius: '8px',
                        color: '#1758BA',
                        borderColor: '#C9DAF5',
                        backgroundColor: '#F1F6FD',
                        '&:hover': { backgroundColor: '#E6EEFB', borderColor: '#1758BA' },
                      }}>
                      {emptyActionText}
                    </Button>
                  )}
                </Box>
              </ListSubheader>
            )}
          </Select>
          {error && <FormHelperText sx={{ color: '#FA4D56' }}>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

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

export function MultiSelectController({ name, chip, label, options, checkbox, placeholder, helperText, sx, ...other }: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const renderValues = (selectedIds: string[]) => {
    const selectedItems = options.filter((item) => selectedIds.includes(`${item.value}@${item.label}`));

    if (!selectedItems.length && placeholder) {
      return (
        <Box component='em' sx={{ color: 'text.disabled' }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size='small' label={item.label} />
          ))}
        </Box>
      );
    }
    return selectedItems.map((item) => item.label).join(', ');
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
            renderValue={renderValues as any}
            MenuProps={{
              PaperProps: {
                sx: { px: 1, maxHeight: 280 },
              },
            }}
            sx={{
              '& .MuiSelect-select.MuiSelect-outlined': {
                fontFamily: 'inherit',
                paddingRight: '33px',
                paddingLeft: '0 !important',
                minWidth: 150,
              },
              '&.MuiInputBase-root': {
                borderRadius: '8px',
                paddingLeft: 2,
                border: error ? '1px solid #FA4D56' : '1px solid #DDE1E6',
                height: {
                  xs: 52,
                },
              },
              '& .MuiSelect-icon': {
                left: 'auto',
                right: '12px',
                color: error ? '#FA4D56' : '#1758BA',
                fontSize: '1.2rem',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            {...other}
            value={!field.value ? [] : Array.isArray(field.value) ? field.value : field.value.split(',') || []}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              const selectedValues = typeof value === 'string' ? value.split(',') : (value as string[]);
              const formattedValues = selectedValues.map((val: any) => {
                const option = options.find((option) => option.value === val);
                return option ? `${option.value}@${option.label}` : val;
              });
              field.onChange(formattedValues);
            }}
            {...other}>
            {placeholder && (
              <MenuItem
                disabled
                value=''
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 0.75,
                  typography: 'body2',
                }}>
                <em> {placeholder} </em>
              </MenuItem>
            )}

            {options?.map((option) => {
              const selected = Array.isArray(field.value) ? field.value.includes(`${option.value}@${option.label}`) : false;

              return (
                <MenuItem
                  key={option.value}
                  value={`${option.value}@${option.label}`}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 0.75,
                    typography: 'body2',
                    ...(selected && {
                      fontWeight: 'fontWeightMedium',
                      color: 'red',
                      backdropFilter: 'red',
                    }),
                    ...(checkbox && {
                      p: 0.25,
                    }),
                    display: 'flex',
                    justifyContent: 'end',
                  }}>
                  {checkbox && <Checkbox disableRipple size='small' checked={selected} />}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
