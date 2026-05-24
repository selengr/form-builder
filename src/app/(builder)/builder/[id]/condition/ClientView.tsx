'use client';

import dynamic from 'next/dynamic';
// templates
import { ConditionSkeleton } from '@/templates/condition';
import ErrorDisplay from '@/templates/condition/ErrorDisplay';

const ConditionList = dynamic(() => import('@/templates/condition/ConditionList'));

interface IProps<T> {
  conditions: any | T[];
  isPending: boolean;
  error: Error | null;
}

export default function ClientView<T>({ conditions, isPending, error }: IProps<T>) {
  return (
    <div className='w-full h-screen px-4 py-4'>
      <div className='md:container mx-auto flex pb-3 flex-col  min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>

        {!error && isPending && <ConditionSkeleton />}
        {!error && !isPending && <ConditionList conditions={conditions} />}
        {error && <ErrorDisplay title='شرط ها' message={error?.message} />}
      </div>
    </div>
  );
}
