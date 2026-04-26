'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup } from '@mui/material';
import ListCard from './ListCard';
import ListGrid from './ListGrid';
import CreateSurveyBtn from './CreateSurveyBtn';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';
import { useGetTargetPlatform } from './hooks/useGetTargetPlatform';
import { IGetTargetPlatform } from '../../../actions/survey/getTargetPlatformAction';
// test branch
export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const [openMyCreateModal, setOpenMyCreateModal] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const [formType, setFormType] = useState<any>({
    isCreatedSoloReport: 'ALL',
    surveyTargetPlatformEnum: 'ALL',
    fieldOperation: "DSC"
  });
  const { TargetPlatform, isFetchingTargetPlatform } = useGetTargetPlatform();
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ];

  const handleIsCreatedSoloReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return { ...prev, isCreatedSoloReport: (event.target as HTMLInputElement).value };
    });
  };
  const handleTargetPlatFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return { ...prev, surveyTargetPlatformEnum: (event.target as HTMLInputElement).value };
    });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormType((prev: any) => {
      return { ...prev, fieldOperation: (event.target as HTMLInputElement).value };
    });
  };

  const CreateButton = () => {
    return (
      <div className='min-w-[50px] w-[50px] h-full'>
        <IconButton
          onClick={() => setOpenMyCreateModal(true)}
          sx={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            border: '1px solid #1758BA',
          }}>
          <Image src={PlusIcon} alt='' width={22} height={22} />
        </IconButton>
      </div>
    )
  }

  const handleCloseDialog = () => {
    setOpenMyCreateModal((prev) => !prev)
  }

  return (
    <>
      <ListGrid
        title='نظرسنجی‌های من'
        textTotal={['تعداد کل نظرسنجی‌ها', 'عدد']}
        searchBoxList={searchBoxList}
        filterBoxList={filterBoxList}
        url='/admin/form/survey/main-list'
        filterComponent={
          <div className='flex h-[calc(100vh-60px)] w-full flex-col items-center justify-between'>
            <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
              <div className='flex items-center w-full justify-center gap-2'>
                <Image src={FilterIcon} width={30} height={30} alt='filter' />
                <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
              </div>
            </div>

            {/* //================= */}
            <div className='flex flex-col gap-4 w-full overflow-y-auto h-full'>
              <div className='flex flex-col gap-4 h-full'>
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
                      }}
                      id='demo-controlled-radio-buttons-group33'>
                      بر اساس گزارش
                    </FormLabel>
                    <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group33' name='controlled-radio-buttons-group33' value={formType.isCreatedSoloReport} onChange={handleIsCreatedSoloReportChange}>
                      <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                      <FormControlLabel value='true' control={<Radio />} label='دارای گزارش' />
                      <FormControlLabel value='false' control={<Radio />} label='بدون گزارش' />
                    </RadioGroup>
                  </FormControl>
                </div>
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
                      }}
                      id='demo-controlled-radio-buttons-group22'>
                      بر اساس سرویس‌گیرنده
                    </FormLabel>
                    <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group22' name='controlled-radio-buttons-group22'
                      value={formType.surveyTargetPlatformEnum} onChange={handleTargetPlatFormChange}>
                      <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                      {isFetchingTargetPlatform && <FormControlLabel value='ALL' control={<Radio />} label='loading...' />}
                      {TargetPlatform?.map((item: IGetTargetPlatform) => (
                        <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.caption} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>
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
                      }}
                      id='demo-controlled-radio-buttons-group'>
                      بر اساس زمان
                    </FormLabel>
                    <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.fieldOperation} onChange={handleTypeChange}>
                      <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
                      <FormControlLabel value='ASC' control={<Radio />} label='قدیمیترین' />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* //================= */}
            <div className='flex gap-4 items-center justify-between w-full mt-8'>
              <Button
                sx={{
                  height: '52px',
                  bgcolor: '#1758BA',
                  boxShadow: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                  '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                    bgcolor: '#1758BA',
                    boxShadow: 'none',
                  },
                }}
                fullWidth
                variant='contained'
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (params.size) {
                    params.delete('query');
                  }
                  push(`${pathname}?${params.toString()}`);
                  setRefreshGrid((prev) => !prev);
                }}>
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
                  '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                  },
                }}
                fullWidth
                variant='outlined'
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  if (params.size) {
                    params.delete('query');
                  }
                  push(`${pathname}?${params.toString()}`);
                  setFormType({ isCreatedSoloReport: 'ALL', surveyTargetPlatformEnum: "ALL", fieldOperation: "DSC" });
                  setRefreshGrid((prev) => !prev);
                }}>
                حذف فیلتر
              </Button>
            </div>
          </div>
        }
        CartComponent={(item: any) => <ListCard {...item} />}
        disableFilter={false}
        showCreateButton={false}
        CreateButton={CreateButton}
        refreshGrid={refreshGrid}
        searchQueryFilter={formType}
      />
      <CreateSurveyBtn open={openMyCreateModal} onClose={handleCloseDialog} />
    </>
  );
}
