'use client';

import dynamic from 'next/dynamic';
// templates
import DesignerTabs from '@/templates/builder/TabComponent';
import CreateCalculatorMobile from '@/templates/calculator/CreateCalculatorMobile';

export default function PageMobile() {
  return (
    <div className='w-full h-screen py-5'>
      <div className='md:container mx-auto flex pb-3 flex-col min-w-screen h-full justify-start items-center bg-white w-full'>
        <DesignerTabs />
         <CreateCalculatorMobile />
        {/* {!error && !isPending && <CalculatorList calculators={calculators} />} */}
      </div>
    </div>
  );
}
