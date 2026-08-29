import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/user-reports-new/ListGridWrapper';
import ListCardSkeleton from '@/templates/user-reports-new/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function DisplayUserReportNewPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="گزارشات"
          totalLabel="تعداد کل گزارش‌ها"
          SkeletonComponent={ListCardSkeleton}
          hasSidebarFilter
        />
      }>
      <ListGridWrapper />
    </Suspense>
  );
}
