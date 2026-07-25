import { Suspense } from 'react';
import ListGridWrapper from '../_component/ListGridWrapper';

export default function DisplayUserReportPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
