import { Suspense } from 'react';
import TestListGridWrapper from '@/templates/test-list-grid/TestListGridWrapper';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import TestListGridCardSkeleton from '@/templates/test-list-grid/TestListGridCardSkeleton';

export default function TestListGridPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="تست List Grid"
          totalLabel="تعداد کل آیتم‌های تست"
          SkeletonComponent={TestListGridCardSkeleton}
          hasSidebarFilter
          hasCreateBtn={true}
        />
      }>
      <TestListGridWrapper />
    </Suspense>
  );
}
