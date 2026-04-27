'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// views
import ListCard from './ListCard';
import ListGrid from './ListGrid';
// images
import MyAssessmentsFilter from './MyAssessmentsFilter';

type TFormTypeFilter = {
  type: 'ALL' | 'COMPETITION' | 'QUESTION' | 'SURVEY' | 'TEST';
  status: 'ALL' | 'PUBLIC' | 'PRIVATE';
  takeParts: 'ALL' | 'only_answered' | 'not_answered';
  showReport: 'ALL' | 'show' | 'not_show';
};
const DEFAULT_FILTER: TFormTypeFilter = {
  type: 'ALL',
  status: 'ALL',
  takeParts: 'ALL',
  showReport: 'ALL',
};


export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const [formType, setFormType] = useState<TFormTypeFilter>(DEFAULT_FILTER);
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ];

  const resetQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    push(`${pathname}?${params.toString()}`);
  };

  const handleApply = () => {
    resetQuery();
    setRefreshGrid((prev) => !prev);
  };

  const handleReset = () => {
    resetQuery();
    setFormType(DEFAULT_FILTER);
    setRefreshGrid((prev) => !prev);
  };

  return (
    <ListGrid
      title='ارزیابی‌های من'
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url='/user/form/main-list'
      filterComponent={
        <MyAssessmentsFilter
          formType={formType}
          setFormType={setFormType}
          onApply={handleApply}
          onReset={handleReset}
        />
      }
      CartComponent={(item: any) => <ListCard {...item} />}
      disableFilter={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}
