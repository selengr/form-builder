import CalculatorList from '@/templates/calculator/CalculatorList';
import { getCalculationListAction } from '../../../../../../actions/calculator/calculation';


export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return <div>آیدی نامعتبر است</div>;

  const data = await getCalculationListAction(id)

  return (
    <CalculatorList calculators={data} />
  )
}


// 'use client';
// import ClientView from './ClientView';
// // _hooks
// import { useGetList } from './_hooks';

// export default function CalculatorPage() {
//   const { data, isPending, error } = useGetList();
//   return <ClientView calculators={data} isPending={isPending} error={error} />;
// }
