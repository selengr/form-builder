import FormCardBase from '@/components/common/FormCardBase';

export default function ListCard({ data }: { data: any }) {
  return (
    <FormCardBase
      data={data}
      buttonText="شرکت در آزمون"
      buttonLink={`/form/${data.id}`}
      showStatus={false}
    />
  );
}