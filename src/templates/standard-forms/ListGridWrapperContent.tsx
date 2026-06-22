'use client';

import dynamic from 'next/dynamic';
import { useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// components
import ListCard from './ListCard';
const ListGrid = dynamic(() => import('./ListGrid'), {
  ssr: false,
});
import PackagingFilter from './PackagingFilter';

interface IFormTypeState {
  isCreatedSoloReport: 'ALL' | 'true' | 'false';
  fieldOperation: 'DSC' | 'ASC';
}

const apiAddress = '/user/packaging/standard-forms-list'

export default function ListGridWrapperContent() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [refreshGrid, setRefreshGrid] = useState<boolean>(false);
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

  return (
    <ListGrid
      url={apiAddress}
      title='فرم های پرکاربرد'
      textTotal={['تعداد کل فرم ها', 'عدد']}
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
      CreateButton={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}