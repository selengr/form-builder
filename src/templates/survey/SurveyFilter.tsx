'use client';

import Image from 'next/image';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';
import { IGetTargetPlatform } from '../../../actions/survey/getTargetPlatformAction';

interface Props {
  formType: any;
  setFormType: (fn: any) => void;
  TargetPlatform: IGetTargetPlatform[];
  isFetchingTargetPlatform: boolean;
  applyFilter: () => void;
  clearFilter: () => void;
}

export default function SurveyFilter({
  formType,
  setFormType,
  TargetPlatform,
  isFetchingTargetPlatform,
  applyFilter,
  clearFilter
}: Props) {

  const handleIsCreatedSoloReportChange = (event: any) => {
    setFormType((prev: any) => ({ ...prev, isCreatedSoloReport: event.target.value }));
  };

  const handleTargetPlatFormChange = (event: any) => {
    setFormType((prev: any) => ({ ...prev, surveyTargetPlatformEnum: event.target.value }));
  };

  const handleTypeChange = (event: any) => {
    setFormType((prev: any) => ({ ...prev, fieldOperation: event.target.value }));
  };

  return (
    <div className='flex h-[calc(100vh-60px)] w-full flex-col items-center justify-between'>

      {/* Header */}
      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
        <Image src={FilterIcon} width={30} height={30} alt='filter' />
        <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
      </div>

      {/* Content */}
      <div className='flex flex-col gap-4 w-full overflow-y-auto h-full'>

        {/* Report Filter */}
        <div className='w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3'>
          <FormControl>
            <FormLabel sx={{ fontSize: 15, fontWeight: 700 }}>بر اساس گزارش</FormLabel>
            <RadioGroup value={formType.isCreatedSoloReport} onChange={handleIsCreatedSoloReportChange}>
              <FormControlLabel value='ALL' control={<Radio />} label='همه' />
              <FormControlLabel value='true' control={<Radio />} label='دارای گزارش' />
              <FormControlLabel value='false' control={<Radio />} label='بدون گزارش' />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Target Filter */}
        <div className='w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3'>
          <FormControl>
            <FormLabel sx={{ fontSize: 15, fontWeight: 700 }}>بر اساس سرویس‌گیرنده</FormLabel>
            <RadioGroup value={formType.surveyTargetPlatformEnum} onChange={handleTargetPlatFormChange}>
              <FormControlLabel value='ALL' control={<Radio />} label='همه' />
              {isFetchingTargetPlatform && <FormControlLabel value='ALL' control={<Radio />} label='loading...' />}
              {TargetPlatform?.map((t) => (
                <FormControlLabel key={t.value} value={t.value} control={<Radio />} label={t.caption} />
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        {/* Time Filter */}
        <div className='w-full bg-[#F7F7FF] rounded-[20px] px-4 pt-4 pb-3'>
          <FormControl>
            <FormLabel sx={{ fontSize: 15, fontWeight: 700 }}>بر اساس زمان</FormLabel>
            <RadioGroup value={formType.fieldOperation} onChange={handleTypeChange}>
              <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
              <FormControlLabel value='ASC' control={<Radio />} label='قدیمی‌ترین' />
            </RadioGroup>
          </FormControl>
        </div>

      </div>

      {/* Footer */}
      <div className='flex gap-4 w-full mt-8'>
        <Button fullWidth variant='contained'
          sx={{
            height: '52px',
            bgcolor: '#1758BA',
            boxShadow: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
          }}
          onClick={applyFilter}>
          اعمال فیلتر
        </Button>
        <Button fullWidth variant='outlined'
          sx={{
            height: '52px',
            bgcolor: 'white',
            border: '1px solid #1758BA',
            boxShadow: 'none',
            borderRadius: '8px',
            color: '#1758BA',
            fontSize: '14px',
            fontWeight: 700,
          
          }}
          onClick={clearFilter}>
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
}
