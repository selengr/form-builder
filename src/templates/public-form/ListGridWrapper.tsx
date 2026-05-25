'use client';

import dynamic from 'next/dynamic';
import PublicFormCard from './ListCard';
import ListGridWrapperSkeleton from '@/components/ListGrid/ListGridWrapperSkeleton';
import CardSkeleton from './CardSkeleton';

const ListGrid = dynamic(() => import('./ListGrid'), {
  ssr: false,
  loading: () => (
    <ListGridWrapperSkeleton
      name='فرم‌های عمومی'
      headerName='تعداد کل فرم‌ها'
      hasCreateBtn={false}
      hasSidebarFilter={false}
      SkeletonComponent={CardSkeleton}
    />
  ),
});

const FORM_FILTER = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function ListGridWrapper() {
  return (
    <ListGrid
      title='فرم‌های عمومی'
      CartComponent={PublicFormCard}
      searchQueryFilter={FORM_FILTER}
      url='/public-page/form/main-list'
    />
  );
}





// const searchBoxList = [
//   {
//     fieldName: 'formSetting.name',
//     fieldOperation: 'MATCH',
//     fieldValue: '',
//     nextConditionOperator: 'OR',
//   },
// ] satisfies SearchBoxItem[];
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
