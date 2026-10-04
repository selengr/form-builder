import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import FormulaListGridWrapper from '@/templates/data-collection/formulas/ListGridWrapper';
import FormulaListCardSkeleton from '@/templates/data-collection/formulas/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function DataCollectionFormulaPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="فرمول‌ها"
          totalLabel="تعداد کل فرمول‌ها"
          SkeletonComponent={FormulaListCardSkeleton}
          hasSidebarFilter
          hasCreateBtn
        />
      }>
      <FormulaListGridWrapper />
    </Suspense>
  );
}
