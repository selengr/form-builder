'use client'

import dynamic from 'next/dynamic'
// templates
import DesignerTabs from '@/templates/builder/TabComponent'
import { ConditionSkeleton } from '@/templates/condition';
const ConditionList = dynamic(() => import('@/templates/condition/ConditionList'))

interface IProps<T> {
  conditions: any|T[];
  isPending: boolean;
  error: Error | null;
}
export default function ClientView<T>({ conditions, isPending, error }: IProps<T>) {
  return (
    <div className="w-full min-h-screen px-4 py-4">
      <div className=" mx-auto flex flex-col min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-40px)] justify-start items-center bg-white rounded-xl w-full">
        <DesignerTabs/>

        {!error && isPending && <ConditionSkeleton />}
        {!error && !isPending && <ConditionList conditions={conditions}/>}
        {error && (
          <div className="flex flex-col absolute top-[250px] justify-center items-center">
            <span className="text-red-500">
              !!خطا در بارگذاری لیست شرط ها
            </span>
            <span>{error?.message}</span>
          </div>
        )}

      </div>
    </div>
  )
}
