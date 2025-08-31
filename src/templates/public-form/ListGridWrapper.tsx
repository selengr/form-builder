'use client';

import ListCard from './ListCard';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ListGrid from '@/components/ListGrid/ListGrid';

export default function ListGridWrapper() {
  const searchParams = useSearchParams()
  const search = searchParams.get("query")
  const [refreshGrid, setRefreshGrid] = useState(false);
  const [formType] = useState<any>({
    type: 'ALL',
    status: 'ALL',
  });
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ];

  useEffect(() => {
    setRefreshGrid((prev) => !prev);
  }, [search]);

  return (
    <ListGrid
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url='/public-page/form/main-list'
      filterComponent={null}
      CartComponent={(item: any) => <ListCard {...item} />}
      disableFilter={false}
      searchQueryFilter={formType}
      refreshGrid={refreshGrid}
      title='فرم‌های عمومی'
    />
  );
}
