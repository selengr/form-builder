import { Suspense } from 'react';
import ListGridWrapper from '@/templates/dataCollection/ListGridWrapper';

export default function DataCollectionPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}