import { Suspense } from 'react';
import ListGridWrapper from '@/templates/builder/ListGridWrapper';

export default function DisplayUserReportPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
