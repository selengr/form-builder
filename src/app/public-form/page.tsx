import { Suspense } from 'react';
import ListGridWrapper from '@/templates/public-form/ListGridWrapper';

function PublicFormPage() {
  return (
    <Suspense>
      <ListGridWrapper />
    </Suspense>
  );
}

export default PublicFormPage;
