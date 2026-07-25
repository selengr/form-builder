'use client';

import Image from 'next/image';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
// action
import { IGetTargetPlatform } from '../../../actions/survey/getTargetPlatformAction';

interface IProps {
  formType: any;
  pathname: string;
  searchParams: any;
  refreshGrid: boolean;
  push: (path: string) => void;
  setFormType: (value: any) => void;
  isFetchingTargetPlatform: boolean;
  TargetPlatform: IGetTargetPlatform[];
  setRefreshGrid: (value: boolean) => void;
}

export default function DataCollectionFilter({
  push,
  formType,
  pathname,
  refreshGrid,
  setFormType,
  searchParams,
  setRefreshGrid,
  TargetPlatform,
  isFetchingTargetPlatform
}: IProps) {

  const handleTargetPlatFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => ({
      ...prev,
      surveyTargetPlatformEnum: (event.target as HTMLInputElement).value,
    }));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => ({
      ...prev,
      fieldOperation: (event.target as HTMLInputElement).value,
    }));
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');

    push(`${pathname}?${params.toString()}`);
    setRefreshGrid(!refreshGrid);
  };

  const resetFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');
    push(`${pathname}?${params.toString()}`);

    setFormType({ surveyTargetPlatformEnum: 'ALL', fieldOperation: 'DSC' });
    setRefreshGrid(!refreshGrid);
  };

  return (
    <div className='flex h-[calc(100vh-60px)] w-full flex-col items-center justify-between'>

      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
        <div className='flex items-center w-full justify-center gap-2'>
          <Image src={FilterIcon} width={30} height={30} alt='filter' />
          <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
        </div>
      </div>

      <div className='flex flex-col gap-4 w-full overflow-y-auto h-full'>
        <div className='flex flex-col gap-4 h-full'>
          
          {/* Filter by Target Platform */}
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
                  '&.Mui-focused': {
                    color: '#161616',
                  },
                }}>
                بر اساس سرویس‌گیرنده
              </FormLabel>

              <RadioGroup
                value={formType.surveyTargetPlatformEnum}
                onChange={handleTargetPlatFormChange}>
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />

                {isFetchingTargetPlatform && (
                  <FormControlLabel value='ALL' control={<Radio />} label='loading...' />
                )}

                {TargetPlatform?.map((item) => (
                  <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.caption}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>

          {/* Filter by Time */}
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
                  '&.Mui-focused': {
                    color: '#161616',
                  },
                }}>
                بر اساس زمان
              </FormLabel>

              <RadioGroup
                value={formType.fieldOperation}
                onChange={handleTypeChange}>
                <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
                <FormControlLabel value='ASC' control={<Radio />} label='قدیمی‌ترین' />
              </RadioGroup>
            </FormControl>
          </div>

        </div>
      </div>

      {/* --- Buttons --- */}
      <div className='flex gap-4 items-center justify-between w-full mt-8'>
        <Button
          sx={{
            height: '52px',
            bgcolor: '#1758BA',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            '&:hover': { bgcolor: '#1758BA' },
          }}
          fullWidth
          onClick={applyFilter}>
          اعمال فیلتر
        </Button>

        <Button
          sx={{
            height: '52px',
            bgcolor: 'white',
            border: '1px solid #1758BA',
            color: '#1758BA',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            '&:hover': { bgcolor: 'transparent' },
          }}
          fullWidth
          onClick={resetFilter}>
          حذف فیلتر
        </Button>
      </div>
    </div>
  );
}
