'use client';

import dynamic from 'next/dynamic';
// templates
import { CalculatorSkeleton } from '@/templates/calculator';
import DesignerTabs from '@/templates/builder/TabComponent';
import ErrorDisplay from '@/templates/condition/ErrorDisplay';
import { ICalculator } from '@/types/calculator';

const CalculatorList = dynamic(() => import('@/templates/calculator/CalculatorList'));

interface IProps<T> {
  calculators: ICalculator[];
  isPending: boolean; 
  error: Error | null;
}
export default function ClientView<T>({ calculators, isPending, error }: IProps<T>) {
  return (
    <div className='w-full h-[calc(100vh)] px-4 py-4 '>
      <div className='md:container mx-auto flex pb-3 flex-col min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>
        <DesignerTabs />
        {!error && isPending && <CalculatorSkeleton />}
        {!error && !isPending && <CalculatorList calculators={calculators} />}
        {error && <ErrorDisplay title='محاسبه گر' message={error?.message} />}
      </div>
    </div>
  );
}
