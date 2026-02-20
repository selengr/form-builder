import { Suspense } from 'react';
import ListGridWrapper from '@/templates/survey/ListGridWrapper';

export default function SurveyPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}