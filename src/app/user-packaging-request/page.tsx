import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import PackagingRequestListGridWrapper from '@/templates/user-packaging-request/ListGridWrapper';
import PackagingRequestListCardSkeleton from '@/templates/user-packaging-request/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function UserPackagingRequestPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="درخواست‌های بسته ارزیابی"
          totalLabel="تعداد کل درخواست‌ها"
          SkeletonComponent={PackagingRequestListCardSkeleton}
          hasSidebarFilter
        />
      }>
      <PackagingRequestListGridWrapper />
    </Suspense>
  );
}
