'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import PublicFormCard from './ListCard';
import CardSkeleton from './CardSkeleton';
import ListGridWrapperSkeleton from '@/components/ListGrid/ListGridWrapperSkeleton';
import FilterSidebar from './FilterSidebar';

const ListGrid = dynamic(() => import('./ListGrid'), {
  ssr: false,
});

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const [formType, setFormType] = useState<any>({
    type: 'ALL',
    status: 'ALL',
    isCreatedSoloReport: 'ALL',
    fieldOperation: "DSC"
  });
  
  const filterBoxList: any = [];

  return (
    <Suspense fallback={<ListGridWrapperSkeleton
      name='فرم‌های عمومی'
      headerName='تعداد کل فرم‌ها'
      hasCreateBtn={false}
      hasSidebarFilter={false}
      SkeletonComponent={CardSkeleton}
    />}>
      <ListGrid
        title='فرم‌های عمومی'
        CartComponent={PublicFormCard}
        searchQueryFilter={formType}
        url='/public-page/form/main-list'
        filterComponent={
        <FilterSidebar 
          formType={formType} 
          setFormType={setFormType} 
          setRefreshGrid={setRefreshGrid}
        />
      }
      filterBoxList={filterBoxList}
      refreshGrid={refreshGrid}
      />
    </Suspense>
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
