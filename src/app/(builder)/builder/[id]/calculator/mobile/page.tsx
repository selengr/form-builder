'use client';

import dynamic from 'next/dynamic';
// templates
import DesignerTabs from '@/templates/builder/TabComponent';

const CalculatorList = dynamic(() => import('@/templates/calculator/CalculatorList'));


export default function PageMobile<T>() {
  return (
    <div className='w-full h-[calc(100vh)] px-4 py-4 '>
      <div className='md:container mx-auto flex pb-3 flex-col min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>
        <DesignerTabs />
        {/* {!error && !isPending && <CalculatorList calculators={calculators} />} */}
      </div>
    </div>
  );
}
