'use client';

import FormCardBase from '@/components/common/FormCardBase';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { PublicFormListItem } from './types';

export default function ListCard({
  data,
}: UnifiedListGridCardProps<PublicFormListItem>) {
  return (
    <FormCardBase
      data={data}
      buttonText="شرکت در آزمون"
      buttonLink={`/form/${data.id}`}
      showStatus={false}
    />
  );
}
