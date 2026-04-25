'use client';
import React from 'react';
import Image from 'next/image';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
// image
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

export type FormTypeValue = 'ALL' | 'COMPETITION' | 'QUESTION' | 'SURVEY' | 'TEST';
export type StatusValue = 'ALL' | 'PUBLIC' | 'PRIVATE';

type TFormType = {
  type: FormTypeValue;
  status: StatusValue;
};
interface IFormFilterProps {
  formType: TFormType;
  onApply: () => void;
  onReset: () => void;
  setFormType: (value: TFormType) => void;
}

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'همه' },
  { value: 'COMPETITION', label: 'مسابقه' },
  { value: 'QUESTION', label: 'پرسشنامه' },
  { value: 'SURVEY', label: 'نظرسنجی' },
  { value: 'TEST', label: 'آزمون' },
] as const;

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'همه' },
  { value: 'PUBLIC', label: 'عمومی' },
  { value: 'PRIVATE', label: 'خصوصی' },
] as const;

const FormFilter = ({ formType, setFormType, onApply, onReset }: IFormFilterProps) => {
  const handleChange = (field: 'type' | 'status') => (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setFormType((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const FilterHeader = () => (
    <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
      <Image src={FilterIcon} width={30} height={30} alt='filter' loading='eager' priority={true} />
      <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
    </div>
  )

  return (
    <div className='flex h-full w-full flex-col items-center justify-between'>
      {FilterHeader()}
      <div className='flex flex-col gap-4 w-full'>
        <RenderRadioGroup
          label="بر اساس نوع"
          field="type"
          value={formType.type}
          onChange={handleChange}
          options={TYPE_OPTIONS}
        />

        <RenderRadioGroup
          label='بر اساس دسترسی'
          field="status"
          value={formType.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className='flex gap-4 items-center justify-between w-full mt-8'>
        <Button
          fullWidth
          variant='contained'
          onClick={onApply}
          sx={{
            height: '52px',
            bgcolor: '#1758BA',
            color: 'white',
            fontWeight: 700,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#1758BA' },
          }}>
          اعمال فیلتر
        </Button>
        <Button
          fullWidth
          variant='outlined'
          onClick={onReset}
          sx={{
            height: '52px',
            border: '1px solid #1758BA',
            color: '#1758BA',
            fontWeight: 700,
            borderRadius: '8px',
          }}>
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
};

export default FormFilter;

// -----------------------------------------------------------------------------
type RadioOption = {
  label: string;
  value: string;
};

type RenderRadioGroupProps = {
  label: string;
  field: 'type' | 'status';
  value: string;
  onChange: (field: 'type' | 'status') => void;
  options: readonly RadioOption[];
};

function RenderRadioGroup({
  label,
  field,
  value,
  onChange,
  options,
}: RenderRadioGroupProps) {
  return (
    <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
      <FormControl
        sx={{
          '& .MuiTypography-root': {
            fontSize: '14px',
            color: '#393939',
            fontWeight: 400,
          },
        }}>
        <FormLabel
          sx={{
            fontSize: '15px',
            color: '#161616',
            fontWeight: 700,
            mb: '8px',
          }}>
          {label}
        </FormLabel>
        <RadioGroup value={field} onChange={() => onChange(field)}>
          {options.map(({ value, label }) => (
            <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  )
}