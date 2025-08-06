'use client';
import React from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

interface Props {
  formType: { type: string; status: string };
  setFormType: (value: { type: string; status: string }) => void;
  setRefreshGrid: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormFilter({ formType, setFormType, setRefreshGrid }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const FilterHeader = React.useMemo(
    () => (
      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
        <Image src={FilterIcon} width={30} height={30} alt='filter' loading='eager' priority={true} />
        <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
      </div>
    ),
    [],
  );
  const handleChange = (key: 'type' | 'status') => (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setFormType((prev) => ({ ...prev, [key]: (event.target as HTMLInputElement).value }));
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');
    push(`${pathname}?${params.toString()}`);
    setRefreshGrid((prev) => !prev);
  };

  const handleResetFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');
    push(`${pathname}?${params.toString()}`);
    setFormType({ type: 'ALL', status: 'ALL' });
    setRefreshGrid((prev) => !prev);
  };

  return (
    <div className='flex h-[calc(100vh-50px)] w-full flex-col'>
      {FilterHeader}

      {/* Filters */}
      <div className='flex-1 overflow-y-auto pb-4'>
        <div className='flex flex-col gap-4 w-full'>
          {/* نوع فرم */}
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
                بر اساس نوع
              </FormLabel>
              <RadioGroup value={formType.type} onChange={handleChange('type')}>
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                <FormControlLabel value='COMPETITION' control={<Radio />} label='مسابقه' />
                <FormControlLabel value='QUESTION' control={<Radio />} label='پرسشنامه' />
                <FormControlLabel value='SURVEY' control={<Radio />} label='نظرسنجی' />
                <FormControlLabel value='TEST' control={<Radio />} label='آزمون' />
              </RadioGroup>
            </FormControl>
          </div>

          {/* وضعیت دسترسی */}
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
                بر اساس دسترسی
              </FormLabel>
              <RadioGroup value={formType.status} onChange={handleChange('status')}>
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                <FormControlLabel value='PUBLIC' control={<Radio />} label='عمومی' />
                <FormControlLabel value='PRIVATE' control={<Radio />} label='خصوصی' />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='sticky bottom-0 bg-white pt-4 pb-2'>
        <div className='flex gap-4 items-center justify-between w-full'>
          <Button
            sx={{
              height: '52px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#1758BA',
              },
            }}
            fullWidth
            variant='contained'
            onClick={handleApplyFilter}>
            اعمال فیلتر
          </Button>
          <Button
            sx={{
              height: '52px',
              bgcolor: 'white',
              border: '1px solid #1758BA',
              boxShadow: 'none',
              borderRadius: '8px',
              color: '#1758BA',
              fontSize: '14px',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
            fullWidth
            variant='outlined'
            onClick={handleResetFilter}>
            حذف فیلتر
          </Button>
        </div>
      </div>
    </div>
  );
}
