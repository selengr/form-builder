'use client';

import { useState } from 'react';
import ListCard from './ListCard';
import ListGrid from '@/components/ListGrid/ListGrid';

export default function ListGridWrapper() {
  const [formType] = useState({
    type: 'ALL',
    status: 'ALL',
  });

  const searchBoxList = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ];

  const filterBoxList: any[] = [];

  return (
    <ListGrid
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url="/public-page/form/main-list"
      filterComponent={null}
      CartComponent={(item) => <ListCard {...item} />}
      disableFilter
      searchQueryFilter={formType}
      title="فرم‌های عمومی"
    />
  );
}