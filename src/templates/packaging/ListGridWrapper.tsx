'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// componenst
import ListCard from './ListCard';
import ListGrid from './ListGrid';
import PackagingFilter from './PackagingFilter';
import CreatePackagingModal from './CreatePackagingModal';
// images
import PlusIcon from '@/../public/images/home-page/Add-fill.svg';
interface IFormTypeState {
  isCreatedSoloReport: 'ALL' | 'true' | 'false';
  fieldOperation: 'DSC' | 'ASC';
}

const apiAddress = '/admin/packaging/main-list'
// --------------------------------------------------------
export default function ListGridWrapper() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [refreshGrid, setRefreshGrid] = useState<boolean>(false);
  const [openMyCreateModal, setOpenMyCreateModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<IFormTypeState>({
    isCreatedSoloReport: 'ALL',
    fieldOperation: "DSC"
  });
  const filterBoxList: any = [];
      const searchBoxList: any = [
        {
          fieldName: 'name',
          fieldOperation: 'MATCH',
          fieldValue: '',
          nextConditionOperator: 'AND',
        },
      ];

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
    setFormType({ isCreatedSoloReport: 'ALL', fieldOperation: "DSC" });
    setRefreshGrid((prev) => !prev);
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
        url={apiAddress}
        title='بسته های ارزیابی'
        textTotal={['تعداد کل بسته ها', 'عدد']}
        searchBoxList={searchBoxList}
        filterBoxList={filterBoxList}
         filterComponent={
          <PackagingFilter
            formType={formType}
            setFormType={setFormType}
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
      <CreatePackagingModal
         open={openMyCreateModal}
         onClose={handleCloseDialog}
       />
    </>
  );
}
