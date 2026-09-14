import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/group-new/ListGridWrapper';
import ListCardSkeleton from '@/templates/group-new/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function GroupNewPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="گروه‌ها"
          totalLabel="تعداد کل گروه‌ها"
          SkeletonComponent={ListCardSkeleton}
          hasSidebarFilter={false}
          hasCreateBtn
        />
      }>
      <ListGridWrapper />
    </Suspense>
  );
}
