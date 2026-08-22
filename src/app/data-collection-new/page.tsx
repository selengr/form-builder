import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import DataCollectionNewListGridWrapper from '@/templates/data-collection-new/ListGridWrapper';
import DataCollectionListCardSkeleton from '@/templates/data-collection-new/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function DataCollectionNewPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="جمع آوری داده"
          totalLabel="تعداد کل دادها"
          SkeletonComponent={DataCollectionListCardSkeleton}
          hasSidebarFilter
          hasCreateBtn
        />
      }>
      <DataCollectionNewListGridWrapper />
    </Suspense>
  );
}
