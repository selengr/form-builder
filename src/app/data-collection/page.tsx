import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import DataCollectionListGridWrapper from '@/templates/data-collection/ListGridWrapper';
import DataCollectionListCardSkeleton from '@/templates/data-collection/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function DataCollectionPage() {
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
      <DataCollectionListGridWrapper />
    </Suspense>
  );
}
