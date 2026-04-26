import { Suspense } from 'react';
import ListGridWrapper from '@/templates/packaging/ListGridWrapper';

export default function PackagingPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}