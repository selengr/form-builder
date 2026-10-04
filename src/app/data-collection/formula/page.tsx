import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import FormulaListGridWrapper from '@/templates/data-collection/formula/ListGridWrapper';
import FormulaListCardSkeleton from '@/templates/data-collection/formula/ListCardSkeleton';

export const dynamic = 'force-dynamic';

// start formula module - major list api and route
// add formula module - major list api, template and route
//start implementing formula module - list api and route

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
