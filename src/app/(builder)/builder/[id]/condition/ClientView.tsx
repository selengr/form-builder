'use client'

import dynamic from 'next/dynamic'
import DesignerTabs from '@/templates/builder/TabComponent'

const ConditionList = dynamic(() => import('@/templates/condition/ConditionList'))

interface IProps<T> {
  conditions: any|T[];
  isPending: boolean;
  error: Error | null;
}
export default function ClientView<T>({ conditions, isPending, error }: IProps<T>) {
  return (
    <div className="w-full min-h-screen px-4 py-4">
      <div className="container mx-auto flex flex-col justify-start items-center bg-white rounded-xl w-full">
        <DesignerTabs/>
        <ConditionList conditions={conditions}/>
      </div>
    </div>
  )
}
