'use client';

import ListCard from './ListCard';
import ListGrid, { type SearchBoxItem } from './ListGrid';

const FORM_FILTER = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

const searchBoxList = [
  {
    fieldName: 'formSetting.name',
    fieldOperation: 'MATCH',
    fieldValue: '',
    nextConditionOperator: 'OR',
  },
] satisfies SearchBoxItem[];

export default function ListGridWrapper() {
  return (
    <ListGrid
      searchBoxList={searchBoxList}
      filterBoxList={[]}
      url='/public-page/form/main-list'
      filterComponent={null}
      CartComponent={ListCard}
      disableFilter={false}
      searchQueryFilter={FORM_FILTER}
      title='فرم‌های عمومی'
    />
  );
}

// 'use client';

// import ListCard from './ListCard';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import ListGrid from '@/components/ListGrid/ListGrid';

// export default function ListGridWrapper() {
//   const searchParams = useSearchParams()
//   const search = searchParams.get("query")
//   const [refreshGrid, setRefreshGrid] = useState(false);
//   const [formType] = useState<any>({
//     type: 'ALL',
//     status: 'ALL',
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

//   useEffect(() => {
//     setRefreshGrid((prev) => !prev);
//   }, [search]);

//   return (
//     <ListGrid
//       searchBoxList={searchBoxList}
//       filterBoxList={filterBoxList}
//       url='/public-page/form/main-list'
//       filterComponent={null}
//       CartComponent={(item: any) => <ListCard {...item} />}
//       disableFilter={false}
//       searchQueryFilter={formType}
//       refreshGrid={refreshGrid}
//       title='فرم‌های عمومی'
//     />
//   );
// }
