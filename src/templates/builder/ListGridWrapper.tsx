'use client';

import React, { useMemo, useState, useCallback } from 'react';
import ListGrid from '@/components/ListGrid/ListGrid';
import ListCard from '@/components/ListGrid/ListCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Image from 'next/image';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

type FormType = {
  type: string;
  status: string;
  isCreatedSoloReport: string;
  fieldOperation: string;
};

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const [formType, setFormType] = useState<FormType>({
    type: 'ALL',
    status: 'ALL',
    isCreatedSoloReport: 'ALL',
    fieldOperation: 'DSC',
  });

  const filterBoxList = useMemo(() => [], []);

  const searchBoxList : any = useMemo(
    () => [
      {
        fieldName: 'formSetting.name',
        fieldOperation: 'MATCH',
        fieldValue: '',
        nextConditionOperator: 'OR',
      },
    ],
    [],
  );

  const handleChange = useCallback(
    (key: keyof FormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormType((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (params.size) params.delete('query');

    push(`${pathname}?${params.toString()}`);
    setRefreshGrid((prev) => !prev);
  }, [pathname, push, searchParams]);

  const resetFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (params.size) params.delete('query');

    push(`${pathname}?${params.toString()}`);

    setFormType({
      type: 'ALL',
      status: 'ALL',
      isCreatedSoloReport: 'ALL',
      fieldOperation: 'DSC',
    });

    setRefreshGrid((prev) => !prev);
  }, [pathname, push, searchParams]);

  const FilterSidebar = () => (
    <div className='flex h-[calc(100vh-50px)] w-full flex-col'>
      <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
        <div className='flex items-center w-full justify-center gap-2'>
          <Image src={FilterIcon} width={30} height={30} alt='filter' draggable={false} />
          <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto pb-4'>
        <div className='flex flex-col gap-4 w-full'>
          
          {/* type */}
          <div className='w-full flex flex-col gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
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
              >بر اساس نوع</FormLabel>
              <RadioGroup value={formType.type} onChange={handleChange('type')}>
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                <FormControlLabel value='COMPETITION' control={<Radio />} label='مسابقه' />
                <FormControlLabel value='QUESTION' control={<Radio />} label='پرسشنامه' />
                <FormControlLabel value='TEST' control={<Radio />} label='آزمون' />
              </RadioGroup>
            </FormControl>
          </div>

          {/* status */}
          <div className='w-full flex flex-col gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
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
              >بر اساس دسترسی</FormLabel>
              <RadioGroup value={formType.status} onChange={handleChange('status')}>
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                <FormControlLabel value='PUBLIC' control={<Radio />} label='عمومی' />
                <FormControlLabel value='PRIVATE' control={<Radio />} label='خصوصی' />
              </RadioGroup>
            </FormControl>
          </div>

          {/* report */}
          <div className='w-full flex flex-col gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
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
              >بر اساس گزارش</FormLabel>
              <RadioGroup
                value={formType.isCreatedSoloReport}
                onChange={handleChange('isCreatedSoloReport')}
              >
                <FormControlLabel value='ALL' control={<Radio />} label='همه' />
                <FormControlLabel value='true' control={<Radio />} label='دارای گزارش' />
                <FormControlLabel value='false' control={<Radio />} label='بدون گزارش' />
              </RadioGroup>
            </FormControl>
          </div>

          {/* date */}
          <div className='w-full flex flex-col gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
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
              >بر اساس زمان</FormLabel>
              <RadioGroup
                value={formType.fieldOperation}
                onChange={handleChange('fieldOperation')}
              >
                <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
                <FormControlLabel value='ASC' control={<Radio />} label='قدیمیترین' />
              </RadioGroup>
            </FormControl>
          </div>

        </div>
      </div>

      {/* <div className='sticky bottom-0 bg-white pt-4 pb-2'>
        <div className='flex gap-4 w-full'>
          <Button fullWidth variant='contained' onClick={applyFilter}>
            اعمال فیلتر
          </Button>
          <Button fullWidth variant='outlined' onClick={resetFilter}>
            حذف فیلتر
          </Button>
        </div>
      </div>
 */}

      
        {/* دکمه‌های ثابت در پایین */}
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
                '&.MuiButtonBase-root:hover': {
                  bgcolor: '#1758BA',
                  boxShadow: 'none',
                },
              }}
              fullWidth
              variant='contained'
              onClick={applyFilter}>
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
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
              }}
              fullWidth
              variant='outlined'
              onClick={resetFilter}>
              حذف فیلتر
            </Button>
          </div>
        </div>
      </div>
    // </div>
  );

  return (
    <ListGrid
      title='فرم‌های من'
      showCreateButton
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url='/form/main-list'
      filterComponent={<FilterSidebar />}
      CartComponent={(item: any) => <ListCard setRefreshGrid={setRefreshGrid} {...item} />}
      disableFilter={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}

// 'use client';

// import React, { useState } from 'react';
// import ListGrid from '@/components/ListGrid/ListGrid';
// import ListCard from '@/components/ListGrid/ListCard';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
// import Image from 'next/image';
// import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

// export default function ListGridWrapper() {
//   const [refreshGrid, setRefreshGrid] = useState(false);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { push } = useRouter();
//   const [formType, setFormType] = useState<any>({
//     type: 'ALL',
//     status: 'ALL',
//     isCreatedSoloReport: 'ALL',
//     fieldOperation: "DSC"
//   });
//   const filterBoxList: any = [];
//   const searchBoxList: any = [
//     {
//       fieldName: 'formSetting.name',
//       fieldOperation: 'MATCH',
//       fieldValue: '',
//       nextConditionOperator: 'OR',
//     },
//   ];

//   const handleIsCreatedSoloReportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormType((prev: any) => {
//       return { ...prev, isCreatedSoloReport: (event.target as HTMLInputElement).value };
//     });
//   };

//   const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormType((prev: any) => {
//       return { ...prev, type: (event.target as HTMLInputElement).value };
//     });
//   };

//   const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormType((prev: any) => {
//       return { ...prev, status: (event.target as HTMLInputElement).value };
//     });
//   };
//   const handleTypeChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFormType((prev: any) => {
//       return { ...prev, fieldOperation: (event.target as HTMLInputElement).value };
//     });
//   };

//   const FilterSidebar = () => {
//     return (
//       <div className='flex h-[calc(100vh-50px)] w-full flex-col'>
//         {/* هدر فیلتر */}
//         <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4'>
//           <div className='flex items-center w-full justify-center gap-2'>
//             <Image src={FilterIcon} width={30} height={30} alt='filter' draggable={false} />
//             <p className='text-[16px] text-center font-bold text-[#161616]'>فیلتر</p>
//           </div>
//         </div>

//         {/* محتوای فیلترها */}
//         <div className='flex-1 overflow-y-auto pb-4'>
//           <div className='flex flex-col gap-4 w-full'>
//             <div className='flex flex-col gap-4'>
//               {/* بخش نوع فیلتر */}
//               <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
//                 <FormControl
//                   sx={{
//                     '& .MuiTypography-root': {
//                       fontSize: '14px',
//                       color: '#393939',
//                       fontWeight: 400,
//                     },
//                   }}>
//                   <FormLabel
//                     sx={{
//                       fontSize: '15px',
//                       color: '#161616',
//                       fontWeight: 700,
//                       mb: '8px',
//                       '&.Mui-focused': {
//                         color: '#161616',
//                       },
//                     }}
//                     id='demo-controlled-radio-buttons-group'>
//                     بر اساس نوع
//                   </FormLabel>
//                   <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.type} onChange={handleTypeChange}>
//                     <FormControlLabel value='ALL' control={<Radio />} label='همه' />
//                     <FormControlLabel value='COMPETITION' control={<Radio />} label='مسابقه' />
//                     <FormControlLabel value='QUESTION' control={<Radio />} label='پرسشنامه' />
//                     {/* <FormControlLabel value='SURVEY' control={<Radio />} label='نظرسنجی' /> */}
//                     <FormControlLabel value='TEST' control={<Radio />} label='آزمون' />
//                   </RadioGroup>
//                 </FormControl>
//               </div>

//               {/* بخش دسترسی فیلتر */}
//               <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
//                 <FormControl
//                   sx={{
//                     '& .MuiTypography-root': {
//                       fontSize: '14px',
//                       color: '#393939',
//                       fontWeight: 400,
//                     },
//                   }}>
//                   <FormLabel
//                     sx={{
//                       fontSize: '15px',
//                       color: '#161616',
//                       fontWeight: 700,
//                       mb: '8px',
//                       '&.Mui-focused': {
//                         color: '#161616',
//                       },
//                     }}
//                     id='demo-controlled-radio-buttons-group'>
//                     بر اساس دسترسی
//                   </FormLabel>
//                   <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.status} onChange={handleStatusChange}>
//                     <FormControlLabel value='ALL' control={<Radio />} label='همه' />
//                     <FormControlLabel value='PUBLIC' control={<Radio />} label='عمومی' />
//                     <FormControlLabel value='PRIVATE' control={<Radio />} label='خصوصی' />
//                   </RadioGroup>
//                 </FormControl>
//               </div>
//               <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
//                 <FormControl
//                   sx={{
//                     '& .MuiTypography-root': {
//                       fontSize: '14px',
//                       color: '#393939',
//                       fontWeight: 400,
//                     },
//                   }}>
//                   <FormLabel
//                     sx={{
//                       fontSize: '15px',
//                       color: '#161616',
//                       fontWeight: 700,
//                       mb: '8px',
//                       '&.Mui-focused': {
//                         color: '#161616',
//                       },
//                     }}
//                     id='demo-controlled-radio-buttons-group33'>
//                     بر اساس گزارش
//                   </FormLabel>
//                   <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group33' name='controlled-radio-buttons-group33' value={formType.isCreatedSoloReport} onChange={handleIsCreatedSoloReportChange}>
//                     <FormControlLabel value='ALL' control={<Radio />} label='همه' />
//                     <FormControlLabel value='true' control={<Radio />} label='دارای گزارش' />
//                     <FormControlLabel value='false' control={<Radio />} label='بدون گزارش' />
//                   </RadioGroup>
//                 </FormControl>
//               </div>

//               <div className='w-full flex flex-col justify-center gap-4 rounded-[20px] bg-[#F7F7FF] px-4 pt-4 pb-3'>
//                 <FormControl
//                   sx={{
//                     '& .MuiTypography-root': {
//                       fontSize: '14px',
//                       color: '#393939',
//                       fontWeight: 400,
//                     },
//                   }}>
//                   <FormLabel
//                     sx={{
//                       fontSize: '15px',
//                       color: '#161616',
//                       fontWeight: 700,
//                       mb: '8px',
//                       '&.Mui-focused': {
//                         color: '#161616',
//                       },
//                     }}
//                     id='demo-controlled-radio-buttons-group'>
//                     بر اساس زمان
//                   </FormLabel>
//                   <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group' name='controlled-radio-buttons-group' value={formType.fieldOperation} onChange={handleTypeChangeDate}>
//                     <FormControlLabel value='DSC' control={<Radio />} label='جدیدترین' />
//                     <FormControlLabel value='ASC' control={<Radio />} label='قدیمیترین' />
//                   </RadioGroup>
//                 </FormControl>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* دکمه‌های ثابت در پایین */}
//         <div className='sticky bottom-0 bg-white pt-4 pb-2'>
//           <div className='flex gap-4 items-center justify-between w-full'>
//             <Button
//               sx={{
//                 height: '52px',
//                 bgcolor: '#1758BA',
//                 boxShadow: 'none',
//                 borderRadius: '8px',
//                 color: 'white',
//                 fontSize: '14px',
//                 fontWeight: 700,
//                 '&.MuiButtonBase-root:hover': {
//                   bgcolor: '#1758BA',
//                   boxShadow: 'none',
//                 },
//               }}
//               fullWidth
//               variant='contained'
//               onClick={() => {
//                 const params = new URLSearchParams(searchParams);
//                 if (params.size) {
//                   params.delete('query');
//                 }
//                 push(`${pathname}?${params.toString()}`);
//                 setRefreshGrid((prev) => !prev);
//               }}>
//               اعمال فیلتر
//             </Button>
//             <Button
//               sx={{
//                 height: '52px',
//                 bgcolor: 'white',
//                 border: '1px solid #1758BA',
//                 boxShadow: 'none',
//                 borderRadius: '8px',
//                 color: '#1758BA',
//                 fontSize: '14px',
//                 fontWeight: 700,
//                 '&.MuiButtonBase-root:hover': {
//                   bgcolor: 'transparent',
//                   boxShadow: 'none',
//                 },
//               }}
//               fullWidth
//               variant='outlined'
//               onClick={() => {
//                 const params = new URLSearchParams(searchParams);
//                 if (params.size) {
//                   params.delete('query');
//                 }
//                 push(`${pathname}?${params.toString()}`);
//                 setFormType({ type: 'ALL', status: 'ALL', isCreatedSoloReport: 'ALL', fieldOperation: "DSC" });
//                 setRefreshGrid((prev) => !prev);
//               }}>
//               حذف فیلتر
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <ListGrid
//       title='فرم‌های من'
//       showCreateButton
//       searchBoxList={searchBoxList}
//       filterBoxList={filterBoxList}
//       url='/form/main-list'
//       filterComponent={<FilterSidebar />}
//       CartComponent={(item: any) => <ListCard setRefreshGrid={setRefreshGrid} {...item} />}
//       disableFilter={false}
//       refreshGrid={refreshGrid}
//       searchQueryFilter={formType}
//     />
//   );
// }
