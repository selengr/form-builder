import { Suspense } from 'react';
import ListGridWrapper from '@/templates/standard-forms/ListGridWrapper';

export default function StandardFormsPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}