'use client';

import { useState } from 'react';
import ListCard from './ListCard';
import ListGrid from '@/components/ListGrid/ListGrid';
import ReportListCardSkeleton from './ReportListCardSkeleton';

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const formType = { type: 'ALL', status: 'PUBLIC', isCreatedSoloReport: 'ALL', fieldOperation: "DSC" };
  const filterBoxList: any = [];
  const searchBoxList: any = [
    {
      fieldName: 'formSetting.name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ];

  return (
    <ListGrid
      title='گزارش‌ها'
      searchBoxList={searchBoxList}
      filterBoxList={filterBoxList}
      url='/form/main-list/reports'
      filterComponent={null}
      CartComponent={(item: any) => <ListCard setRefreshGrid={setRefreshGrid} {...item} />}
      disableFilter
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
      SkeletonComponent={()=> <ReportListCardSkeleton />}
    />
  );
}
