import { Suspense } from 'react';
import UnifiedListGridLayoutSkeleton from '@/components/unified-list-grid/UnifiedListGridLayoutSkeleton';
import SurveyListGridWrapper from '@/templates/survey/ListGridWrapper';
import SurveyListCardSkeleton from '@/templates/survey/ListCardSkeleton';

export const dynamic = 'force-dynamic';

export default function SurveyPage() {
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
      <SurveyListGridWrapper />
    </Suspense>
  );
}
