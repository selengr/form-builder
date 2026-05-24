'use client';
import ClientView from './ClientView';
// _hooks
import { useGetList } from './_hooks';

export default function CalculatorPage() {
  const { data, isPending, error } = useGetList();
  return <ClientView calculators={data} isPending={isPending} error={error} />;
}



// export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
//   // منتظر بمانید تا params مقداردهی شود
//   const { id } = await params;

//   return <div>آیدی دریافت شده: {id}</div>;
// }
