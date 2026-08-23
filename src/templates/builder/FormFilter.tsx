'use client';

import React from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Image from 'next/image';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

export type FormFilter = {
  type: 'ALL' | 'COMPETITION' | 'QUESTION' | 'TEST';
  status: 'ALL' | 'PUBLIC' | 'PRIVATE';
  isCreatedSoloReport: 'ALL' | 'true' | 'false';
  fieldOperation: 'ASC' | 'DSC';
};

type Props = {
  formType: FormFilter;
  onChange: (key: keyof FormFilter) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApply: () => void;
  onReset: () => void;
};

function FilterSidebar({ formType, onChange, onApply, onReset }: Props) {
  return (
    <div className='flex h-[calc(100vh-50px)] w-full flex-col '>
      
      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
        <div className='flex items-center w-full justify-center gap-2'>
          <Image src={FilterIcon} width={30} height={30} alt='filter' draggable={false} unoptimized/>
          <p className='text-[16px] font-bold text-[#161616]'>فیلتر</p>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto pb-4'>
        <div className='flex flex-col gap-4 w-full'>

          <FilterBox label="بر اساس نوع">
            <RadioGroup value={formType.type} onChange={onChange('type')}>
              <FormControlLabel value='ALL' control={<Radio />} label='همه' />
              <FormControlLabel value='COMPETITION' control={<Radio />} label='مسابقه' />
              <FormControlLabel value='QUESTION' control={<Radio />} label='پرسشنامه' />
              <FormControlLabel value='TEST' control={<Radio />} label='آزمون' />
            </RadioGroup>
          </FilterBox>

          <FilterBox label="بر اساس دسترسی">
            <RadioGroup value={formType.status} onChange={onChange('status')}>
              <FormControlLabel value='ALL' control={<Radio />} label='همه' />
              <FormControlLabel value='PUBLIC' control={<Radio />} label='عمومی' />
              <FormControlLabel value='PRIVATE' control={<Radio />} label='اختصاصی' />
            </RadioGroup>
          </FilterBox>

          <FilterBox label="بر اساس گزارش">
            <RadioGroup value={formType.isCreatedSoloReport} onChange={onChange('isCreatedSoloReport')}>
              <FormControlLabel value='ALL' control={<Radio />} label='همه' />
              <FormControlLabel value='true' control={<Radio />} label='دارای گزارش' />
              <FormControlLabel value='false' control={<Radio />} label='بدون گزارش' />
            </RadioGroup>
          </FilterBox>

          <FilterBox label="بر اساس زمان">
            <RadioGroup value={formType.fieldOperation} onChange={onChange('fieldOperation')}>
              <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
              <FormControlLabel value='ASC' control={<Radio />} label='قدیمیترین' />
            </RadioGroup>
          </FilterBox>

        </div>
      </div>

      <div className='sticky bottom-0 bg-white pt-4 pb-2'>
        <div className='flex gap-4'>
          <Button fullWidth variant='contained' onClick={onApply}>
            اعمال فیلتر
          </Button>

          <Button fullWidth variant='outlined' onClick={onReset}>
            حذف فیلتر
          </Button>
        </div>
      </div>

    </div>
  );
}

function FilterBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
      <FormControl>
        <FormLabel
          sx={{
            fontSize: '15px',
            color: '#161616',
            fontWeight: 700,
            mb: '8px',
          }}
        >
          {label}
        </FormLabel>
        {children}
      </FormControl>
    </div>
  );
}

export default React.memo(FilterSidebar);
