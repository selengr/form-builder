import { Suspense } from 'react';
import ListGridWrapperContent from './ListGridWrapperContent';
import ListCardSkeleton from '@/components/ListGrid/ListCardSkeleton';
import ListGridWrapperSkeleton from '@/components/ListGrid/ListGridWrapperSkeleton';

export default function ListGridWrapper() {
  return (
    <Suspense fallback={
      <ListGridWrapperSkeleton
        name='فرم‌های من'
        headerName='تعداد کل فرم‌ها'
        SkeletonComponent={ListCardSkeleton}
      />
    }>
      <ListGridWrapperContent />
    </Suspense>
  );
}