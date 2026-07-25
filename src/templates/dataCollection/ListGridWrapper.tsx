'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// components
import ListCard from './ListCard';
import ListGrid from './ListGrid';
import DataCollectionFilter from './DataCollectionFilter';
import CreateDataCollectionBtn from './CreateDataCollectionBtn';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
// hooks
import { useGetTargetPlatform } from './hooks/useGetTargetPlatform';

const apiAddress ='/admin/form/data-collection/main-list'
// --------------------------------------------------------
export default function ListGridWrapper() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formType, setFormType] = useState<any>({
    surveyTargetPlatformEnum: 'ALL',
    fieldOperation: "DSC"
  });
  const [refreshGrid, setRefreshGrid] = useState<boolean>(false);
  const [openMyCreateModal, setOpenMyCreateModal] = useState<boolean>(false);

  const { TargetPlatform, isFetchingTargetPlatform } = useGetTargetPlatform();
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'AND',
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

  const handleCloseDialog = () => {
    setOpenMyCreateModal((prev) => !prev)
  }

  return (
    <>
      <ListGrid
        url={apiAddress}
        title='جمع آوری داده'
        textTotal={['تعداد کل دادها', 'عدد']}
        searchBoxList={searchBoxList}
        filterBoxList={filterBoxList}
        filterComponent={
            <DataCollectionFilter
              push={push}
              pathname={pathname}
              formType={formType}
              refreshGrid={refreshGrid}
              setFormType={setFormType}
              searchParams={searchParams}
              setRefreshGrid={setRefreshGrid}
              TargetPlatform={TargetPlatform!}
              isFetchingTargetPlatform={isFetchingTargetPlatform}
          />
        }
        disableFilter={false}
        showCreateButton={false}
        refreshGrid={refreshGrid}
        CreateButton={CreateButton}
        searchQueryFilter={formType}
        CartComponent={(item: any) => <ListCard {...item} />}
      />
      <CreateDataCollectionBtn open={openMyCreateModal} onClose={handleCloseDialog} />
    </>
  );
}
