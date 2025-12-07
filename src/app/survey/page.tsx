import { Suspense } from 'react';
import ListGridWrapper from '@/templates/survey/ListGridWrapper';

export default function MyAssessmentPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
