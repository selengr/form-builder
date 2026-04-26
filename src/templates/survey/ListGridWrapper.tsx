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
import SurveyFilter from './SurveyFilter';
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

   const applyFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');
    push(`${pathname}?${params.toString()}`);
    setRefreshGrid((prev) => !prev);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (params.size) params.delete('query');

    push(`${pathname}?${params.toString()}`);
    setFormType({ isCreatedSoloReport: 'ALL', surveyTargetPlatformEnum: "ALL", fieldOperation: "DSC" });
    setRefreshGrid((prev) => !prev);
  };

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
          <SurveyFilter
            formType={formType}
            setFormType={setFormType}
            TargetPlatform={TargetPlatform!}
            isFetchingTargetPlatform={isFetchingTargetPlatform}
            applyFilter={applyFilter}
            clearFilter={clearFilter}
          />
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
