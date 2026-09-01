import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/user-reports/ListGridWrapper';
import ListCardSkeleton from '@/templates/user-reports/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function DisplayUserReportPage() {
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
