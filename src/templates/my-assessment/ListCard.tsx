'use client';
import FormCardBase from '@/components/common/FormCardBase';

interface ListCardProps {
  data: {
    id: string | number;
    [key: string]: any;
  };
}

export default function ListCard({ data }: ListCardProps) {
  return (
    <FormCardBase
      data={data}
      buttonText="شرکت در آزمون"
      buttonLink={`/form/${data.id}`}
    />
  );
}
