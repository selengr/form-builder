'use client'

import dynamic from 'next/dynamic'
import DesignerTabs from '@/templates/builder/TabComponent'

const CalculatorList = dynamic(
  () => import('@/templates/calculator/CalculatorList'))

export default function ClientView({calculators}: { calculators: any[] }) {
  return (
    <div className="w-full min-h-full px-4 py-4 ">
      <div className="container mx-auto flex flex-col justify-start items-center h-full bg-white rounded-xl w-full">
        <DesignerTabs/>
        <CalculatorList calculators={calculators}/>
      </div>
    </div>
  )
}
