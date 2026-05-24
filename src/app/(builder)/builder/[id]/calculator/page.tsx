'use client';
import CalculatorList from '@/templates/calculator/CalculatorList';
import { getCalculationListAction } from '../../../../../../actions/calculator/calculation';
// import ClientView from './ClientView';
// _hooks
// import { useGetList } from './_hooks';

// export default function CalculatorPage() {
//   const { data, isPending, error } = useGetList();
//   return <ClientView calculators={data} isPending={isPending} error={error} />;
// }




export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

    if (!id) return <div>آیدی نامعتبر است</div>;

   const data = await getCalculationListAction(id)

  return (
    <div className='w-full h-screen px-4 py-4'>
      <div className='md:container mx-auto flex pb-3 flex-col  min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>
        <CalculatorList calculators={data} />
    </div>
    </div>
  )
}
