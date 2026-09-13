import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/builder-new/ListGridWrapper';
import ListCardSkeleton from '@/templates/builder-new/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function BuilderNewPage() {
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
