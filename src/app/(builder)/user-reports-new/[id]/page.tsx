import { Suspense } from 'react';
import ListGridWrapper from '@/templates/user-reports-new/ListGridWrapper';

export default function DisplayUserReportNewPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
