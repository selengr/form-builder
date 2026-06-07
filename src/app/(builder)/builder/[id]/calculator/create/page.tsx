'use client';

import { useLayoutEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
// templates
import CreateCalculatorMobile from '@/templates/calculator/CreateCalculatorMobile';
import EditCalculatorDialogMobile from '@/templates/calculator/EditCalculatorDialogMobile';

export default function PageMobile() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('calcId');

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
  }, []);

  return (
    <div className='w-full h-[calc(100vh)] pt-5'>
      <div className='md:container mx-auto flex pb-3 flex-col min-w-screen h-full justify-start items-center bg-white w-full'>
        {!search && <CreateCalculatorMobile />}
        {search && <EditCalculatorDialogMobile calcId={JSON.parse(search)} />}
      </div>
    </div>
  );
}
