'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// componenst
import ListCard from './ListCard';
import ListGrid from './ListGrid';
import SurveyFilter from './SurveyFilter';
import CreateSurveyModal from './CreateSurveyModal';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
// hooks
import { useGetTargetPlatform } from './hooks/useGetTargetPlatform';

interface IFormTypeState {
  isCreatedSoloReport: 'ALL' | 'true' | 'false';
  surveyTargetPlatformEnum: string;
  fieldOperation: 'DSC' | 'ASC';
}
const apiAddress = '/admin/form/survey/main-list'
// --------------------------------------------------------
export default function ListGridWrapper() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [refreshGrid, setRefreshGrid] = useState<boolean>(false);
  const [openMyCreateModal, setOpenMyCreateModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<IFormTypeState>({
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
        url={apiAddress}
        title='نظرسنجی‌های من'
        textTotal={['تعداد کل نظرسنجی‌ها', 'عدد']}
        searchBoxList={searchBoxList}
        filterBoxList={filterBoxList}
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
      <CreateSurveyModal
         open={openMyCreateModal}
         onClose={handleCloseDialog} 
       />
    </>
  );
}
