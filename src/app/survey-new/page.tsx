import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import SurveyNewListGridWrapper from '@/templates/survey-new/ListGridWrapper';
import SurveyListCardSkeleton from '@/templates/survey-new/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function SurveyNewPage() {
  return (
    <Suspense
      fallback={
        <UnifiedListGridLayoutSkeleton
          title="نظرسنجی‌های من"
          totalLabel="تعداد کل نظرسنجی‌ها"
          SkeletonComponent={SurveyListCardSkeleton}
          hasSidebarFilter
          hasCreateBtn
        />
      }>
      <SurveyNewListGridWrapper />
    </Suspense>
  );
}
