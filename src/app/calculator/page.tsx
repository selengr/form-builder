
import dynamic from 'next/dynamic'
 

const AdvancedFormulaEditor = dynamic(() => import('@/components/calculator/AdvancedFormulaEditor'), { ssr: false })
 
export default function Calculator() {
  return (
    <div  className="flex min-h-screen flex-col items-center justify-between p-24">
        <AdvancedFormulaEditor />
    </div>
  )
}