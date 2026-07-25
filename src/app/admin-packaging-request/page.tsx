import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import AdminPackagingRequestListGridWrapper from '@/templates/admin-packaging-request/ListGridWrapper';
import AdminPackagingRequestListCardSkeleton from '@/templates/admin-packaging-request/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function AdminPackagingRequestPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="رسیدگی به درخواست‌های آنلاین سازی آزمون"
          totalLabel="تعداد کل درخواست‌ها"
          SkeletonComponent={AdminPackagingRequestListCardSkeleton}
          hasSidebarFilter
        />
      }>
      <AdminPackagingRequestListGridWrapper />
    </Suspense>
  );
}
