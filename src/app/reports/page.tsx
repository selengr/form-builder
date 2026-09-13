import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import ListGridWrapper from '@/templates/reports/ListGridWrapper';
import ReportListCardSkeleton from '@/templates/reports/ReportListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="گزارش‌ها"
          totalLabel="تعداد کل فرم‌ها"
          SkeletonComponent={ReportListCardSkeleton}
          hasSidebarFilter={false}
          hasCreateBtn={false}
        />
      }>
      <ListGridWrapper />
    </Suspense>
  );
}
