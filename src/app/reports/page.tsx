import { Suspense } from 'react';
import ListGridWrapper from '@/templates/reports/ListGridWrapper';

export default function ReportsPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}
