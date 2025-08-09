'use client';

import { useParams, useRouter } from 'next/navigation';
// templates
import DesignerTabs from '@/templates/builder/TabComponent';
import CreateCalculatorMobile from '@/templates/calculator/CreateCalculatorMobile';
import { useLayoutEffect } from 'react';

export default function PageMobile() {
    const { id } = useParams();
      const router = useRouter();

      useLayoutEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          router.push(`/builder/${id}/calculator`); 
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [router]);
    
  return (
    <div className='w-full h-[calc(100vh)] pt-5'>
      <div className='md:container mx-auto flex pb-3 flex-col min-w-screen h-full justify-start items-center bg-white w-full'>
        <DesignerTabs />
         <CreateCalculatorMobile />
        {/* {!error && !isPending && <CalculatorList calculators={calculators} />} */}
      </div>
    </div>
  );
}
