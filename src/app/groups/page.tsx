import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/groups/ListGridWrapper';
import ListCardSkeleton from '@/templates/groups/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function GroupsPage() {
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
