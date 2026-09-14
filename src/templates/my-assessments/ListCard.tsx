'use client';

import FormCardBase from '@/components/common/FormCardBase';
import { UnifiedListGridCardProps } from '@/components/unified-list-grid';
import { MyAssessmentsListItem } from './types';

export default function ListCard({
  data,
}: UnifiedListGridCardProps<MyAssessmentsListItem>) {
  return (
    <FormCardBase
      data={data}
      buttonText="شرکت در آزمون"
      buttonLink={`/form/${data.id}`}
    />
  );
}
