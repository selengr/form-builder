import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/standard-forms/ListGridWrapper';
import ListCardSkeleton from '@/templates/standard-forms/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function StandardFormsPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="فرم های پرکاربرد"
          totalLabel="تعداد کل فرم ها"
          SkeletonComponent={ListCardSkeleton}
          hasSidebarFilter
          hasCreateBtn={false}
        />
      }>
      <ListGridWrapper />
    </Suspense>
  );
}
