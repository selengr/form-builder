import { Suspense } from 'react';
import ListCardSkeleton from './ListCardSkeleton';
import ListGridWrapperContent from './ListGridWrapperContent';
import ListGridWrapperSkeleton from '@/components/ListGrid/ListGridWrapperSkeleton';

export default function ListGridWrapper() {
  return (
    <Suspense fallback={
      <ListGridWrapperSkeleton
        name='فرم‌های عمومی'
        headerName='تعداد کل فرم‌ها'
        hasCreateBtn={false}
        hasSidebarFilter={false}
        SkeletonComponent={ListCardSkeleton}
      />
    }>
      <ListGridWrapperContent />
    </Suspense>
  );
}