import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/builder/ListGridWrapper';
import ListCardSkeleton from '@/templates/builder/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="فرم‌های من"
          totalLabel="تعداد کل فرم‌ها"
          SkeletonComponent={ListCardSkeleton}
          hasSidebarFilter
          hasCreateBtn
        />
      }>
      <ListGridWrapper />
    </Suspense>
  );
}
